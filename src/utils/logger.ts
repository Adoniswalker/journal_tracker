import winston, { format } from 'winston';

const logger = winston.createLogger({
    level: 'info', // Set the minimum logging level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamps
        format.json() // Format logs as JSON
    ),
    transports: [
        new winston.transports.File({ filename: 'app.log' }), // Log to a file
        new winston.transports.Console() // Also log to the console
    ]
});

export default logger;
