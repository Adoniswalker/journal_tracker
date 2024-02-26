import {Journal} from "../jounal/model";
import {AppDataSource} from "../data-source";
import envVarsSchema from "./env_validator";

import FormData from 'form-data';
import Mailgun, {MailgunMessageData} from 'mailgun.js';
import logger from "./logger";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({username: 'api', key: envVarsSchema.MAILGUN_KEY});

const SendEmailHelper = (emailData: MailgunMessageData) => {
    mg.messages.create(envVarsSchema.MAILGUN_DOMAIN, emailData)
        .then(error => logger.debug('Email sent successfully:', error))
        .catch(error => logger.error('Error sending email:', error))
}

export const checkMails = async () => {
    try {
        // Get current date and time
        const currentDate = new Date();

        // Calculate the date and time 24 hours ago
        const previousDate = new Date(currentDate);
        previousDate.setDate(previousDate.getDate() - 1);
        const journalRepository = AppDataSource.getRepository(Journal);

        const journals = await journalRepository
            .createQueryBuilder('journal')
            .leftJoinAndSelect("journal.author", "author")
            .select(['journal.id', "journal.content", "journal.createdAt", "author.id", "author.email"])
            .getMany()
        if (!journals.length) {
            logger.debug('No journal entries from the previous day to send.');
            return;
        }

        interface EntryMap {
            [authorId: string]: Journal[];
        }

        const entriesToSend: EntryMap = {};

        // Group journal entries by author
        journals.forEach(journal => {
            const authorId: string = journal.author.id.toString();
            if (!entriesToSend[authorId]) {
                entriesToSend[authorId] = [];
            }
            entriesToSend[authorId].push(journal);
        });

        // Send entries to random users who posted on the same day
        const authorIds: string[] = Object.keys(entriesToSend);

        for (const authorId of authorIds) {
            const recipients: string[] = authorIds.filter(id => id !== authorId);

            if (recipients.length === 0) {
                logger.debug(`Author with ID ${authorId} is the only author for the day. No entries to send.`);
                continue;
            }

            const randomRecipientId: string = recipients[Math.floor(Math.random() * recipients.length)];
            const randomRecipientEntries: Journal[] = entriesToSend[randomRecipientId];
            const entryToSend: Journal = randomRecipientEntries[Math.floor(Math.random() * randomRecipientEntries.length)];
            const recipientEmail: string = entriesToSend[authorId][0].author.email;
            SendEmailHelper({
                from: envVarsSchema.MAILGUN_SENDER,
                to: recipientEmail,
                subject: `Journal entry From One of Your friends`,
                text: `Here is a journal entry from another user: \n ${entryToSend.content}`
            });
        }
        logger.info('Emails queued successfully!');
    } catch (error) {
        logger.error('Error sending emails:', error);
    }
}
