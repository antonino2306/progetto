const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");

router.get("/", (req, res) => {
  res.send(`User ID: ${req.session.user.id}, 
    First Name: ${req.session.user.firstName}, 
    Last Name: ${req.session.user.lastName}`);
});

// route per aggiornare i dati dell'utente
router.post("/", async (req, res) => {
  const { firstName, lastName, email } = req.body;
  // Uso un'unica route per aggiornare i dati dell'utente
  // In caso non devo aggiornare tutti i campi, quelli che devono rimanere invariati
  // verranno inclusi nella richiesta con il loro valore attuale
  try {
    await User.updateUser(req.session.user.id, req.body);

    req.session.user = {
      id: req.session.user.id,
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante l'aggiornamento dei dati dell'utente",
    });
  }
});

// route per aggiornare la mail
router.post("/update-mail", async (req, res) => {
  console.log("Dati arrivati: ", req.body);

  const { newMail } = req.body;

  try {
    if (!newMail) {
      return res.status(400).json({
        success: false,
        message: "Nuova email richiesta",
      });
    }

    const result = await User.updateMail(req.session.user.id, newMail);

    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Utente non trovato") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Errore durante l'aggiornamento della mail",
    });
  }
});

// route per aggiornare la password
router.post("/update-passwd", async (req, res) => {
  console.log("Dati arrivati: ", req.body);

  const { password, newPassword } = req.body;

  try {
    if (!password || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password e nuova password sono richieste",
      });
    }

    const result = await User.updatePassword(
      req.session.user.id,
      password,
      newPassword
    );

    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Utente non trovato") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    if (err.message === "Password sbagliata") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Errore durante l'aggiornamento della password",
    });
  }
});

// route per ottenere gli eventi preferiti dell'utente
router.get("/favorites", async (req, res) => {
  try {
    const favoriteShows = await User.getFavoriteShows(req.session.user.id);

    res.status(200).json({
      success: true,
      favoriteShows: favoriteShows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Errore durante il recupero degli eventi preferiti",
    });
  }
});

// route per ottenere tutte le recensioni fatte dall'utente
router.get("/get-review", async (req, res) => {
  try {
    const reviews = await User.getReviews(req.session.user.id);

    res.status(200).json({
      success: true,
      reviews: reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante il recupero delle recensioni",
    });
  }
});

router.post("/new-review", async (req, res) => {
  try {
    const { showID, rate, description } = req.body;
    console.log(req.body);
    await User.createNewReview(req.session.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante l'aggiunta della recensione",
    });
  }
});

// route per ottenere tutti gli ordini dell'utente
router.get("/orders", async (req, res) => {
  try {
    let orders = await User.getOrders(req.session.user.id);

    orders.map((order) => {
      order.eventTitles = order.eventTitles.split(',');
      order.cardNumber = '****-****-****-' + order.cardNumber.slice(-4);
    })

    res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante il recupero degli ordini",
    });
  }
});

// route per ottenere tutti i biglietti di un utente
router.get("/tickets", async (req, res) => {
  try {
    const tickets = await User.getTickets(req.session.user.id);

    res.status(200).json({
      success: true,
      tickets: tickets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante il recupero dei biglietti",
    });
  }
});

// route per aggiungere un metodo di pagamento
router.post("/payment", async (req, res) => {
  try {
    const { cardNumber, expirationDate, cvc, isDefault, type, cardHolderName } =
      req.body;

    if (
      !cardNumber ||
      !expirationDate ||
      !cvc ||
      !isDefault ||
      !type ||
      !cardHolderName
    ) {
      return res.status(400).json({
        success: false,
        message: "Card number, expiration date and CVC are required",
      });
    }

    await User.setPaymentMethod(req.session.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Payment method set successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante l'impostazione del metodo di pagamento",
    });
  }
});

// route per ottenere i metodi di pagamento dell'utente
router.get("/payment-obtain", async (req, res) => {
  try {
    let paymentMethods = await User.getPaymentMethods(req.session.user.id);

    paymentMethods.map((pm) => {
      pm.cardNumber = "**** **** **** " + pm.cardNumber.slice(-4);
    });

    res.status(200).json({
      success: true,
      paymentMethods: paymentMethods,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante il recupero dei metodi di pagamento",
    });
  }
});

// route per aggiornare un metodo di pagamento
router.put("/payment-obtain/:pmID/:op", async (req, res) => {
  try {
    const { pmID, op } = req.params;

    if (op === "update") {
      await User.setDefaultPaymentMethod(req.session.user.id, pmID);
    }

    if (op === "delete") {
      await User.deletePaymentMethod(req.session.user.id, pmID);
    }

    res.status(200).json({
      success: true,
      message: "Payment method updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante l'aggiornamento del metodo di pagamento",
    });
  }
});

// route per eliminare l'account dell'utente
router.post("/delete-account", async (req, res) => {
  try {
    await User.deleteAccount(req.session.user.id);

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Errore durante la disconnessione",
        });
      }
      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante l'eliminazione dell'account",
    });
  }
});

router.get("/favorite-categories", async (req, res) => {
  try {
    const categories = await User.getFavoriteCategories(req.session.user.id);

    res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante il recupero delle categorie preferite",
    });
  }
});

router.post("/favorite-categories/add", async (req, res) => {
  try {
    const { categoryID } = req.body;

    if (!categoryID) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    await User.addFavoriteCategory(req.session.user.id, categoryID);

    res.status(200).json({
      success: true,
      message: "Favorite categories set successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Errore durante l'impostazione delle categorie preferite",
    });
  }
});


module.exports = router;
