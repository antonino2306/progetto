const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Event = require("../models/event");

// Prendi tutto il carrello
router.get("/", async (req, res) => {
  const userID = req.session.user.id;
  console.log(userID);

  try {
    const eventsInCart = await Cart.getCart(userID);

    res.status(200).json({
      success: true,
      events: eventsInCart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore nel caricamento del carrello",
    });
  }
});

// Aggiungi un evento al carrello
router.post("/add", async (req, res) => {
  const { showID, quantity } = req.body;
  console.log(req.body);
  const userID = req.session.user.id;

  try {
    const isAlreadyInside = await Cart.getEventByUserID(userID, showID);
    if (isAlreadyInside) {
      await Cart.increaseQuantity(userID, showID, quantity);
    } else {
      await Cart.addElementToCart(userID, showID, quantity);
    }

    res.status(200).json({
      success: true,
      message: "Evento aggiunto al carrello",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante l'aggiunta dell'evento al carrello",
    });
  }
});

// Elimina un evento dal carrello
router.put("/delete", async (req, res) => {
  const { showID, removeAll } = req.body;
  const userID = req.session.user.id;

  console.log(req.body);
  try {
    const event = await Cart.getEventByUserID(userID, showID);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Evento non trovato nel carrello",
      });
    }

    if (removeAll || event.quantity === 1) {
      await Cart.deleteElementFromCart(userID, showID);
    } else {
      await Cart.decreaseQuantity(userID, showID);
    }

    res.status(200).json({
      success: true,
      message: "Evento rimosso dal carrello",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante la rimozione dell'evento dal carrello",
    });
  }
});

// Elimina tutti gli elementi dal carrello di un utente
router.put("/delete-all", async (req, res) => {
  const userID = req.session.user.id;

  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Utente non autenticato",
    });
  }
  
  try {
    
    await Cart.clearCart(userID);
    
    res.status(200).json({
      success: true,
      message: "Carrello svuotato con successo",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante lo svuotamento del carrello",
    });
  }
});


router.get("/:showID/available-tickets", async (req, res) => {
    const showID = req.params.showID;

    try {
        const availableTickets = await Event.getAvailableTickets(showID);

        res.status(200).json({
            success: true,
            availableTickets: availableTickets.availableTickets,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero dei biglietti disponibili",
        });
    }
})

router.post("/block-seat", async (req, res) => {

  const {showID, quantity} = req.body;

  try {
    
    if (!showID || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Il carrello è vuoto"
      });
    }
    
      await Cart.blockSeat(showID, quantity);
    
    
  } catch(err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Errore durante il blocco dei posti",
    });
  }
  
  res.status(200).json({
    success: true,
    message: "Posti bloccati con successo",
  });

});

router.post("/unblock-seat-all", async (req, res) => {
  const userID = req.session.user.id;

  if (!userID) {
    return res.status(401).json({
      success: false,
      message: "Utente non autenticato",
    });
  }

  try {
    const cart = await Cart.getCart(userID);

    for (const item of cart) {
      await Cart.unblockSeat(item.id, item.quantity);
    }

    res.status(200).json({
      success: true,
      message: "Tutti i posti sbloccati con successo",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Errore durante lo sblocco dei posti",
    });
  }
});

router.post("/unblock-seat", async (req, res) => {

  const {showID} = req.body;

  try {
    
    if (!showID ) {
      return res.status(400).json({
        success: false,
        message: "Il carrello è vuoto"
      });
    }
    
      await Cart.unblockSeat(showID, 1);
    
    
  } catch(err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Errore durante lo sblocco dell'evento",
    });
  }
  
  res.status(200).json({
    success: true,
    message: "Posto sloccato con successo",
  });
  
});

module.exports = router;
