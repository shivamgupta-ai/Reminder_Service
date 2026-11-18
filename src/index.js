const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { PORT } = require('./config/serverConfig');

const { sendBasicEmail } = require('./services/email-service');
const jobs = require('./utils/job');
const apiRoutes = require('./routes/index');

const { createChannel, subscribeMessage } = require('./utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('./config/serverConfig');
const emailService = require('./services/email-service');

const db = require('./models/index');

const setupAndStartServer = async () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', apiRoutes);

    // Connect to message queue and subscribe to events
    const channel = await createChannel();
    subscribeMessage(channel, emailService.subscribeEvents, REMINDER_BINDING_KEY);

    app.listen(PORT, () => {
        console.log(`Server started at Port: ${PORT}`);

        // Sync DB if needed (uncomment DB_SYNC in .env)
        if (process.env.DB_SYNC) {
            db.sequelize.sync({ alter: true });
        }

        // Start cron jobs for processing pending email notifications
        jobs();
    });
}

setupAndStartServer();
