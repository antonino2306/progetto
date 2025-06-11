const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { loginValidator, validate, registerValidator, isAuthenticated } = require('../middlewares/auth');
// La route auth di default è quella di login
router.post('/', loginValidator, validate, async (req, res) => {
    console.log('Dati arrivati: ', req.body);
    console.log('Richiesta inviata da: ', req.ip);

    const { email, password, rememberMe } = req.body;

    try {

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            req.session.user = {
                id: user.userID,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };

            if (rememberMe) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 giorni
            }

            return res.status(200).json({
                success: true,
                user: req.session.user,
                message: 'Login successful'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });

    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

})

router.post('/register', registerValidator, validate, async (req, res) => {
    console.log('Dati registrazione: ', req.body);

    try {

        // Controllo se l'utente esiste già
        const existingUser = await User.findByEmail(req.body.email);
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists' });
        }
        
        // Inserisco il nuovo utente nel database
        const userID = await User.create(req.body)

        console.log("Utente inserito con ID: ", userID);

        if (userID) {

            req.session.user = {
                id: userID,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            };

            return res.status(201).json({
                success: true,
                user: req.session.user,
                message: 'User registered successfully'
            });
        }
    }
    catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
        res.json({
            success: true,
            message: 'Logout successful',
        });
    })
    console.log(req.session);
})

router.get('/is-authenticated', (req, res) => {
    console.log('Richiesta inviata da: ', req.ip);
    if (req.session.user) {
        return res.status(200).json({
            success: true,
            user: req.session.user
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'No active session'
        });
    }
})

router.get('/get-user', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.user.id);
    console.log('user: ', user);
    if (user) {
        req.session.user = {
            id: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
        console.log("user session: ", req.session.user);

        return res.status(200).json({
            success: true,
            user: req.session.user
        });
    }
    else {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
})

module.exports = router;