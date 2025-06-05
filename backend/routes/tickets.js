const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');

// Route to change the holder name of a ticket
router.put('/change-holder-name', async (req, res) => {
    const { ticketID, holderName , holderSurname} = req.body;

    try {
        await Ticket.changeHolderName(ticketID, holderName, holderSurname);
        res.status(200).json({ success: true, message: 'Holder name updated successfully' });
    } catch (error) {
        console.error('Error updating holder name:', error);
        res.status(500).json({ success: false, message: 'Failed to update holder name' });
    }
})

// Route to change the status of a ticket
router.put('/change-ticket-status', async (req, res) => {
    const { ticketID } = req.body;

    try {
        await Ticket.changeTicketStatus(ticketID);
        res.status(200).json({ success: true, message: 'Ticket status updated successfully' });
    } catch (error) {
        console.error('Error updating ticket status:', error);
        res.status(500).json({ success: false, message: 'Failed to update ticket status' });
    }
})

module.exports = router;