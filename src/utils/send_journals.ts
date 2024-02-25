import cron from "node-cron";
import {Journal} from "../jounal/model";
import {AppDataSource} from "../data-source";
// import {User} from "../users/model";
import {MoreThanOrEqual} from "typeorm";
import exp from "node:constants";
// cron.schedule('0 12 * * *', async () => {
//
// });
type JournalResponse = {
    id: number;
    content: string;
    createdAt: Date;
    author: {
        id: number;
        author: string
    }
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
        type IntKeyObject<T> = {
            [key: number]: T;
        };
        const emails: Set<string> = new Set();
        journals.forEach((journal) => {
            emails.add(journal.author.email);
        });
        const activeUsers = journals.map(journal => ({
            id: journal.author.id,
            email: journal.author.email,
            entries: journals.filter(otherEntry => otherEntry.author.id !== journal.author.id) // Exclude self-posts
        }));
        type StringKeyDictionary<T> = {
            [key: string]: T;
        };
        const userMailsToReceive: StringKeyDictionary<Journal[]> = {};
        journals.forEach(journal => {
            if (!userMailsToReceive[journal.author.email]) {
                userMailsToReceive[journal.author.email] = [journal]
            } else {
                userMailsToReceive[journal.author.email].push(journal)
            }
        })
        console.log('happening')

        // Prepare and send emails to users
        // for (const email of emails) {
        //     // const userJournals = journalsByUser[user.id];
        //     // const randomJournal = userJournals[Math.floor(Math.random() * userJournals.length)];
        //     for (const journal in journals) {
        //         const transporter = createTransport({
        //             // Configure your email transport here
        //         });
        //
        //         await transporter.sendMail({
        //             from: 'your@email.com',
        //             to: user.email,
        //             subject: 'Your random journal entry',
        //             text: `Here is a journal entry from another user: ${randomJournal.content}`
        //         });
        //     }
        // }

        console.log('Emails sent successfully!');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}

const dennis = [
    {'content': "james", 'mail': "dennisngeno7@gmail.com"},
    {'content': "ngeno", 'mail': "dennisngeno1@gmail.com"},
    {'content': "mike", 'mail': "dennisngeno2@gmail.com"},
    {'content': "chemosi", 'mail': "dennisngeno7@gmail.com"},
]
const mails = {
    'dennisngeno7@gmail.com': [{'content': "ngeno", 'mail': "dennisngeno1@gmail.com"},
        {'content': "mike", 'mail': "dennisngeno2@gmail.com"},]
}
