const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Il tuo modello utente esistente

// Configurazione del trasporto email
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Chiave segreta per JWT - IN AMBIENTE DI PRODUZIONE USA UNA VARIABILE D'AMBIENTE!
const JWT_SECRET = process.env.JWT_SECRET ;

// Endpoint per verificare se l'email esiste
router.post('/verify-email', async (req, res) => {
  const { email } = req.body;
  console.log('Dati Arrivati: ', req.body);

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Error during email verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Endpoint per richiedere il reset della password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Dati per il reset della password: ', req.body);

    // Verifica se l'utente esiste
    const user = await User.findByEmail(email);

    if (!user) {
      // Non rivelare se l'email esiste
      return res.status(200).json({
        success: true,
        message: 'Riceverai un\'email con le istruzioni'
      });
    }

    // Crea un token JWT con scadenza dopo 1 ora
    const token = jwt.sign(
      {
        userId: user.userID, // <-- usa user.userID se il campo si chiama così nel DB
        email: user.email,
        purpose: 'password-reset'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // URL di reset (frontend)
    const resetUrl = `http://localhost:8100/password-modify?token=${token}`;

    // Costruisci il messaggio email
    const mailOptions = {
      from: 'thedreamteam6212@gmail.com', // <-- usa qui la mail validata su Brevo!
      to: email,
      subject: 'Reset della tua password',
      html: `
        <h2>Hai richiesto il reset della password</h2>
        <p>Clicca sul seguente link per reimpostare la tua password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>Questo link scadrà tra un'ora.</p>
        <p>Se non hai richiesto il reset della password, ignora questa email.</p>
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

// Endpoint per reimpostare la password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verifica il token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Il link per il reset della password non è valido o è scaduto'
      });
    }

    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({
        success: false,
        message: 'Token non valido per questa operazione'
      });
    }

    // Trova l'utente
    const user = await User.findByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    // Aggiorna la password SENZA la vecchia password (usa già hash internamente)
    await User.updatePasswordWithoutOld(user.userID, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password aggiornata con successo'
    });

  } catch (error) {
    console.error('Errore durante il reset della password:', error);
    res.status(500).json({
      success: false,
      message: 'Si è verificato un errore durante il reset della password'
    });
  }
});

module.exports = router;
