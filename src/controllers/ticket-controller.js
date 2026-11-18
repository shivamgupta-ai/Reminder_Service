const serviceTicket = require('../services/email-service');

const create = async (req, res) => {
    try {
        const response = await serviceTicket.createNotification(req.body);
        res.status(201).json({
            data: response,
            success: true,
            message: 'Successfully registered an email reminder',
            err: {}
        });
    } catch (error) {
        res.status(500).json({
            data: [],
            success: false,
            message: 'Unable to register an email reminder',
            err: error
        });
    }
}

const getAll = async (req, res) => {
    try {
        const response = await serviceTicket.getAll();
        res.status(200).json({
            data: response,
            success: true,
            message: 'Successfully fetched tickets',
            err: {}
        });
    } catch (error) {
        res.status(500).json({
            data: [],
            success: false,
            message: 'Unable to fetch tickets',
            err: error
        });
    }
}

const fetchPendingEmail = async (req, res) => {
    try {
        const response = await serviceTicket.fetchPendingEmail();
        res.status(200).json({
            data: response,
            success: true,
            message: 'Successfully fetched pending tickets',
            err: {}
        });
    } catch (error) {
        res.status(500).json({
            data: [],
            success: false,
            message: 'Unable to fetch pending tickets',
            err: error
        });
    }
}

module.exports = {
    create,
    getAll,
    fetchPendingEmail
}
