import {Journal} from "../jounal/model";
import {AppDataSource} from "../data-source";
import envVarsSchema from "./env_validator";

import FormData from 'form-data';
import Mailgun, {MailgunMessageData} from 'mailgun.js';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({username: 'api', key: envVarsSchema.MAILGUN_KEY});

const SendEmailHelper = (emailData: MailgunMessageData) => {
    mg.messages.create(envVarsSchema.MAILGUN_DOMAIN, emailData)
        .then(error => console.log('Email sent successfully:', error))
        .catch(error => console.error('Error sending email:', error))
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
            console.log('No journal entries from the previous day to send.');
            return;
        }
        const emails: Set<string> = new Set();
        journals.forEach((journal) => {
            emails.add(journal.author.email);
        });
        for (const journal of journals) {
            SendEmailHelper({
                from: envVarsSchema.MAILGUN_SENDER,
                to: Array.from(emails).filter(email => email !== journal.author.email),
                subject: `Journal entry by ${journal.author.email}`,
                text: `Here is a journal entry from another user: ${journal.content}`
            });
            }
        console.log('Emails queued successfully!');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}
