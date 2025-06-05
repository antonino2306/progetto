const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const Ticket = require("../models/ticket");
const Event = require("../models/event");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// route per effettuare il pagamento
router.post("/", async (req, res) => {

    const { pmID, total, shows } = req.body;
    console.log("Dati ricevuti: ", req.body);

    try {

        if(!pmID || !total || !shows) {
            return res.status(400).json({
                success: false,
                message: "Dati richiesti non forniti"
            });
        }

        const order = await Order.createNewOrder(req.session.user.id, total, pmID);
        
        const ticketPromises = shows.flatMap(show =>
            show.tickets.map(async (holder) => {
                const ticket = await Ticket.create(
                    order,
                    show.showID ?? show.id,
                    holder.firstName,
                    holder.lastName
                );
                await Event.updateAvailableTickets(show.showID ?? show.id);
                return ticket;
            })
        );
        
        // Attendi che tutte le promesse siano risolte
        await Promise.all(ticketPromises);

        // Dopo aver completato l'ordine, svuota il carrello
        await Cart.clearCart(req.session.user.id);

        if(order){
            res.status(200).json({
                success: true,
                message: "Ordine effettuato con successo"
            });
        }    
 
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante la fase di pagamento",
        });
    }

});

router.post('/payment-email-success', async (req, res) => {
  try {
    const email = req.session.user.email;
    
    console.log("Session user:", req.session.user);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email non fornita"
      });
    }


    // Costruisci il messaggio email
    const mailOptions = {
      from: 'thedreamteam6212@gmail.com', // <-- usa qui la mail validata su Brevo!
      to: email,
      subject: 'Conferma pagamento',
      html: `
        <h2>Pagamento avvenuto con successo!</h2>
        <p>Grazie per il tuo acquisto.</p>
      `
    };

    // Invia l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Se l\'indirizzo email è registrato, riceverai un\'email con le istruzioni'
    });

  } catch (error) {
    console.error('Errore nel processo di reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Si è verificato un errore durante il processo'
    });
  }
});

module.exports = router;