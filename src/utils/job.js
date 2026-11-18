const cron = require('node-cron');
const emailService = require('../services/email-service');
const sender = require('../config/emailConfig');
const getTicketTemplate = require('./getTicketTemplate');

const setupJobs = () => {

    // Run every 2 minutes - check for pending notification tickets and send emails
    cron.schedule('*/2 * * * *', async () => {
        const response = await emailService.fetchPendingEmail();

        if (!response || response.length === 0) {
            console.log('No pending emails to send');
            return;
        }

        response.forEach((email) => {
            sender.sendMail({
                to: email.receipientEmail,
                subject: email.subject,
                html: getTicketTemplate({
                    passengerName: 'Passenger',
                    flightNumber: 'SK-205',
                    seat: '14A',
                    from: 'DEL',
                    to: 'BOM',
                    departureTime: '08:30 AM',
                    date: new Date().toDateString(),
                    bookingId: 'BK' + email.id
                }),
                text: email.content
            }, async (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    await emailService.updateTicket(email.id, 'Success');
                }
            });
        });
        console.log(`Processed ${response.length} pending email(s)`);
    });
}

module.exports = setupJobs;
