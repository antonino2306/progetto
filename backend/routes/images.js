const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Middleware per validazione del filename
const validateFilename = (req, res, next) => {
  const filename = req.params.filename;

  // Validazione di sicurezza: previeni path traversal
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return res.status(400).json({ error: "Nome file non valido" });
  }

  // Validazione estensione
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(filename).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ error: "Tipo file non supportato" });
  }

  next();
};

// Route per immagini eventi
router.get("/events/:filename", validateFilename, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../images/events", filename);
  const defaultPath = path.join(__dirname, "../images/defaults/default-event.png");

  // Controlla se il file esiste
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`File non trovato: ${filename}, usando default`);

      // Verifica che il default esista
      fs.access(defaultPath, fs.constants.F_OK, (defaultErr) => {
        if (defaultErr) {
          return res.status(404).json({ error: "Immagine non disponibile" });
        }

        // Imposta header per indicare che è un'immagine di default
        res.set("X-Default-Image", "true");
        res.sendFile(path.resolve(defaultPath));
      });
    } else {
      // File trovato, invialo
      res.set("X-Default-Image", "false");
      res.sendFile(path.resolve(filePath));
    }
  });
});

// Route per immagini artisti
router.get("/artists/:filename", validateFilename, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../images/artists", filename);
  const defaultPath = path.join(__dirname, "../images/defaults/default-artist.png");

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      fs.access(defaultPath, fs.constants.F_OK, (defaultErr) => {
        if (defaultErr) {
          return res.status(404).json({ error: "Immagine artista non disponibile" });
        }
        res.set("X-Default-Image", "true");
        res.sendFile(path.resolve(defaultPath));
      });
    } else {
      res.set("X-Default-Image", "false");
      res.sendFile(path.resolve(filePath));
    }
  });
});

// Route per immagini categorie
router.get("/categories/:filename", validateFilename, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../images/categories", filename);
  const defaultPath = path.join(__dirname, "../images/defaults/default-category.png");

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      fs.access(defaultPath, fs.constants.F_OK, (defaultErr) => {
        if (defaultErr) {
          return res.status(404).json({ error: "Immagine categoria non disponibile" });
        }
        res.set("X-Default-Image", "true");
        res.sendFile(path.resolve(defaultPath));
      });
    } else {
      res.set("X-Default-Image", "false");
      res.sendFile(path.resolve(filePath));
    }
  });
});

module.exports = router;
