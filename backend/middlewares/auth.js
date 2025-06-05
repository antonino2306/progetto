const { body, validationResult } = require("express-validator");

function isAuthenticated(req, res, next) {
  console.log(req.session);

  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  next();
}

// controllo che i campi siano valorizzati per la registrazione
const registerValidator = [
  body("firstName").notEmpty().withMessage("FirstName è obbligatorio"),
  body("lastName").notEmpty().withMessage("FirstName è obbligatorio"),
  body("email").isEmail().withMessage("Email non valida"),
  body("password")
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(
      "Password deve essere di almeno 6 caratteri, contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Le password non coincidono");
    }
    return true;
  }),
];

// controllo che i campi siano valorizzati per il login
const loginValidator = [
  body("email").notEmpty().withMessage("Email è obbligatoria"),
  body("password").notEmpty().withMessage("Password è obbligatoria"),
];

// Raccoglie tutti gli errori di validazione usando validationResult(req)
// questo aggiunge uno strato intermedio che controlla se ci sono errori da altri validatori
// e se ci sono errori, restituisce un errore 400 con gli errori di validazione
// questo middleware viene eseguito dopo i validatori definiti sopra e può essere associato a quasiasi nuovo validatore
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  isAuthenticated,
  registerValidator,
  loginValidator,
  validate,
};
