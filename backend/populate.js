const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  // Category
  db.run(`DELETE FROM Category`);
  db.run(`INSERT INTO Category (name) VALUES 
    ("Concerto"),
    ("Mostra d'Arte"),
    ("Teatro"),
    ("Festival"),
    ("Opera"),
    ("Danza"),
    ("Cinema"),
    ("Workshop"),
    ("Comedy"),
    ("Gastronomia")
  `);

  // Artist

  db.run(`INSERT INTO Artist (name, type, genre, image, popularity) VALUES 
    ("Coldplay", "Band", "Rock/Pop", "coldplay.jpg", 95),
    ("Ed Sheeran", "Solista", "Pop", "edsheeran.jpg", 92),
    ("Laura Pausini", "Solista", "Pop", "laurapausini.jpg", 88),
    ("Roberto Bolle", "Ballerino", "Danza Classica", "robertobolle.jpg", 85),
    ("Alessandro Baricco", "Scrittore", "Letteratura", "baricco.jpg", 75),
    ("Ludovico Einaudi", "Pianista", "Classica Contemporanea", "einaudi.jpg", 87),
    ("Banksy", "Artista Visivo", "Street Art", "banksy.jpg", 94),
    ("Compagnia della Rancia", "Compagnia Teatrale", "Musical", "rancia.jpg", 78),
    ("Elio Germano", "Attore", "Teatro/Cinema", "eliogermano.jpg", 82),
    ("Måneskin", "Band", "Rock", "maneskin.jpg", 90),
    ("Marina Abramović", "Performance Artist", "Arte Contemporanea", "abramovic.jpg", 84),
    ("Teatro alla Scala", "Orchestra/Compagnia", "Opera/Classica", "scala.jpg", 93),
    ("Jovanotti", "Solista", "Pop/Rap", "jovanotti.jpg", 86),
    ("Cirque du Soleil", "Compagnia Circense", "Circo Contemporaneo", "cirquedusoleil.jpg", 91),
    ("Stefano Bollani", "Pianista", "Jazz", "bollani.jpg", 83),
    ("Alessandro Cattelan", "Presentatore", "Comedy/Intrattenimento", "cattelan.jpg", 80),
    ("Ferzan Özpetek", "Regista", "Cinema", "ozpetek.jpg", 79),
    ("Massimo Bottura", "Chef", "Gastronomia", "bottura.jpg", 89),
    ("Mahmood", "Solista", "Pop/Urban", "mahmood.jpg", 87),
    ("Elisa", "Solista", "Pop/Rock", "elisa.jpg", 86),
    ("Gianna Nannini", "Solista", "Rock", "nannini.jpg", 84),
    ("Arturo Brachetti", "Trasformista", "Teatro", "brachetti.jpg", 81)
  `);

  // Event

  db.run(`INSERT INTO Event (categoryID, title, description, coverImage, backgroundImage) VALUES
    (1, "Coldplay - Music Of The Spheres World Tour", "I Coldplay tornano in Italia con il loro tour mondiale. Una serata indimenticabile tra effetti speciali, braccialetti luminosi e le hit che hanno segnato generazioni.", "coldplay_cover.jpg", "coldplay_bg.jpg"),
    (1, "Ed Sheeran - Mathematics Tour", "Ed Sheeran si esibirà in uno stadio completamente sold out con i suoi più grandi successi e le nuove canzoni del suo ultimo album.", "edsheeran_cover.jpg", "edsheeran_bg.jpg"),
    (1, "Laura Pausini - World Tour 2025", "La regina del pop italiano porta sul palco i suoi più grandi successi in una tournée mondiale che farà tappa nelle principali città italiane.", "pausini_cover.jpg", "pausini_bg.jpg"),
    (2, "Banksy: The Art of Protest", "Una straordinaria retrospettiva delle opere più significative dell'enigmatico artista britannico, simbolo della street art contemporanea e della protesta sociale attraverso l'arte.", "banksy_cover.jpg", "banksy_bg.jpg"),
    (2, "Marina Abramović: The Cleaner", "Retrospettiva completa dell'opera di Marina Abramović, una delle artiste più importanti del nostro tempo, pioniera della performance art.", "abramovic_cover.jpg", "abramovic_bg.jpg"),
    (3, "Così è (se vi pare) - con Elio Germano", "Celebre opera di Luigi Pirandello interpretata magistralmente da Elio Germano. Una riflessione profonda sulla verità e sulle apparenze.", "pirandello_cover.jpg", "teatro_bg.jpg"),
    (3, "Alessandro Baricco: Novecento", "Il monologo cult di Alessandro Baricco torna in scena con una nuova produzione. La storia del leggendario pianista che non ha mai messo piede sulla terraferma.", "baricco_cover.jpg", "novecento_bg.jpg"),
    (6, "Roberto Bolle and Friends", "L'étoile della danza mondiale torna con il suo straordinario gala che riunisce alcune delle stelle più brillanti del panorama tersicoreo internazionale.", "bolle_cover.jpg", "bolle_bg.jpg"),
    (5, "La Traviata - Teatro alla Scala", "Il capolavoro di Giuseppe Verdi nell'iconico Teatro alla Scala di Milano. Una nuova produzione con i migliori interpreti del panorama lirico internazionale.", "traviata_cover.jpg", "scala_bg.jpg"),
    (4, "Festival di Sanremo 2026", "La 76ª edizione del Festival della Canzone Italiana, l'evento musicale più atteso dell'anno che porta sul palco dell'Ariston i migliori artisti del panorama italiano.", "sanremo_cover.jpg", "sanremo_bg.jpg"),
    (1, "Måneskin - RUSH! World Tour", "I Måneskin, fenomeno rock italiano di fama mondiale, tornano nei più grandi stadi italiani con il loro tour mondiale dopo il successo internazionale.", "maneskin_cover.jpg", "maneskin_bg.jpg"),
    (1, "Einaudi - Underwater Tour", "Un viaggio sonoro immersivo con il maestro Ludovico Einaudi che presenterà dal vivo il suo album Underwater in un'atmosfera intima e suggestiva.", "einaudi_cover.jpg", "einaudi_bg.jpg"),
    (3, "Grease - Il Musical", "Il musical più amato di sempre torna in scena con la Compagnia della Rancia. Le avventure di Danny, Sandy e gli studenti del liceo Rydell sulle note delle indimenticabili canzoni degli anni '50.", "grease_cover.jpg", "grease_bg.jpg"),
    (7, "Festival del Cinema di Venezia 2025", "La 82ª edizione della Mostra Internazionale d'Arte Cinematografica, uno degli eventi cinematografici più prestigiosi al mondo con anteprime e star internazionali.", "venezia_cover.jpg", "venezia_bg.jpg"),
    (1, "Jovanotti - Jova Beach Party 2026", "Ritorna l'evento musicale dell'estate! Una grande festa sulla spiaggia con Jovanotti e numerosi ospiti per ballare fino al tramonto.", "jova_cover.jpg", "jova_bg.jpg"),
    (6, "Cirque du Soleil - Alegría", "Il celebre spettacolo del Cirque du Soleil torna completamente rinnovato. Un'esperienza immersiva tra acrobazie mozzafiato e performance artistiche di altissimo livello.", "cirque_cover.jpg", "cirque_bg.jpg"),
    (4, "Umbria Jazz 2025", "La 53ª edizione del festival jazz più importante d'Italia. Dieci giorni di concerti con artisti internazionali e il meglio della scena jazz italiana, con la partecipazione speciale di Stefano Bollani.", "umbriajazz_cover.jpg", "umbriajazz_bg.jpg"),
    (9, "Alessandro Cattelan - Da Grande Live Show", "Il popolare conduttore televisivo porta in tour il suo one man show con musica, ospiti e momenti di comicità. Un formato innovativo che mescola talk show e intrattenimento dal vivo.", "cattelan_cover.jpg", "cattelan_bg.jpg"),
    (7, "Retrospettiva Ferzan Özpetek", "Un viaggio attraverso i capolavori del regista turco-italiano. Proiezioni speciali, incontri con il pubblico e una mostra fotografica dedicata ai suoi film più celebri.", "ozpetek_cover.jpg", "ozpetek_bg.jpg"),
    (10, "Masterclass con Massimo Bottura", "Un'occasione unica per imparare i segreti della cucina d'autore con lo chef tristellato Massimo Bottura. Workshop pratico seguito da una cena degustazione.", "bottura_cover.jpg", "bottura_bg.jpg"),
    (1, "Mahmood - Arena Tour 2025", "Dopo il successo internazionale, il cantautore italiano porta nei palazzetti il suo nuovo album. Un concerto che fonde sonorità pop, urban e world music.", "mahmood_cover.jpg", "mahmood_bg.jpg"),
    (1, "Elisa - Back To The Future Live Tour", "Un tour dedicato alla sostenibilità ambientale con la voce inconfondibile di Elisa che presenterà i suoi successi e i brani del nuovo album.", "elisa_cover.jpg", "elisa_bg.jpg"),
    (1, "Gianna Nannini - European Tour", "La rocker italiana per eccellenza torna con un tour europeo che farà tappa nelle principali città italiane. Una serata di pura energia rock con i suoi più grandi successi.", "nannini_cover.jpg", "nannini_bg.jpg"),
    (3, "Arturo Brachetti - SOLO", "Il più grande trasformista al mondo in uno spettacolo che è un viaggio nella sua arte straordinaria. Oltre 60 personaggi in uno show che mescola magia, illusione e trasformismo.", "brachetti_cover.jpg", "brachetti_bg.jpg"),
    (8, "Workshop di Fotografia Contemporanea", "Tre giorni intensivi dedicati alla fotografia d'autore con docenti di fama internazionale. Teoria, pratica e sessioni di scatto sul campo.", "foto_cover.jpg", "foto_bg.jpg")
  `);

  // Location

  db.run(`INSERT INTO Location (name, address, city, maxCapacity, coordinates) VALUES
    ("Stadio San Siro", "Via Piccolomini 5", "Milano", 80000, "45.4781,9.1236"),
    ("Stadio Olimpico", "Viale dei Gladiatori", "Roma", 70000, "41.9341,12.4547"),
    ("Arena di Verona", "Piazza Bra 1", "Verona", 15000, "45.4386,10.9946"),
    ("Teatro alla Scala", "Via Filodrammatici 2", "Milano", 2000, "45.4675,9.1891"),
    ("Palazzo Reale", "Piazza del Duomo 12", "Milano", 5000, "45.4640,9.1919"),
    ("Auditorium Parco della Musica", "Via Pietro de Coubertin 30", "Roma", 3000, "41.9284,12.4747"),
    ("PalaAlpitour", "Corso Sebastopoli 123", "Torino", 12000, "45.0414,7.6476"),
    ("Palazzo delle Esposizioni", "Via Nazionale 194", "Roma", 2000, "41.9005,12.4930"),
    ("Teatro Arcimboldi", "Viale dell'Innovazione 20", "Milano", 2400, "45.5125,9.2058"),
    ("Teatro Sistina", "Via Sistina 129", "Roma", 1800, "41.9043,12.4868"),
    ("Teatro San Carlo", "Via San Carlo 98", "Napoli", 1400, "40.8368,14.2494"),
    ("Palazzo Strozzi", "Piazza degli Strozzi", "Firenze", 1500, "43.7712,11.2499"),
    ("Unipol Arena", "Via Gino Cervi 2", "Casalecchio di Reno", 20000, "44.4933,11.2836"),
    ("Galleria degli Uffizi", "Piazzale degli Uffizi 6", "Firenze", 3000, "43.7677,11.2558"),
    ("Museo MAXXI", "Via Guido Reni 4A", "Roma", 2500, "41.9287,12.4658"),
    ("Circo Massimo", "Via del Circo Massimo", "Roma", 60000, "41.8857,12.4842"),
    ("Teatro Antico", "Via del Teatro Greco", "Taormina", 5000, "37.8525,15.2866"),
    ("Palazzo dei Congressi", "Piazza John Kennedy 1", "Roma", 3500, "41.8314,12.4763"),
    ("Palazzo Ducale", "Piazza Matteotti 9", "Genova", 1800, "44.4087,8.9316"),
    ("Arena Flegrea", "Via John Fitzgerald Kennedy 54", "Napoli", 6000, "40.8268,14.1728"),
    ("Teatro Verdi", "Via Ghibellina 99", "Firenze", 1500, "43.7696,11.2652"),
    ("Forte di Bard", "Via Vittorio Emanuele II 85", "Bard", 1000, "45.6075,7.7476"),
    ("Palazzo Vecchio", "Piazza della Signoria", "Firenze", 2000, "43.7693,11.2558"),
    ("Autodromo di Monza", "Viale di Vedano 5", "Monza", 100000, "45.6218,9.2909"),
    ("Maratona Beach", "Lungomare Deledda", "Rimini", 30000, "44.0619,12.5784"),
    ("Villa Manin", "Piazza Manin 10", "Codroipo", 8000, "45.9630,12.8727"),
    ("Teatro Regio", "Piazza Castello 215", "Torino", 1600, "45.0709,7.6868"),
    ("Teatro Massimo", "Piazza Verdi", "Palermo", 1300, "38.1198,13.3598"),
    ("Piazza Plebiscito", "Piazza del Plebiscito", "Napoli", 40000, "40.8359,14.2486"),
    ("Castello Sforzesco", "Piazza Castello", "Milano", 5000, "45.4704,9.1797")
  `);

  // Show
  db.run(`INSERT INTO Show (eventID, locationID, startDate, endDate, price, availableTickets, totalTickets) VALUES
    (1, 1, 1749920400, 1749934800, 120.00, 75000, 75000),
    (2, 2, 1750525200, 1750539600, 95.00, 68000, 68000),
    (3, 3, 1748710800, 1748725200, 85.00, 14000, 14000),
    (4, 4, 1746724800, 1754258400, 15.00, 5000, 5000),
    (5, 5, 1747329600, 1754863200, 18.00, 2500, 2500),
    (6, 6, 1751130000, 1751144400, 45.00, 1800, 1800),
    (7, 7, 1748278800, 1748293200, 85.00, 12000, 12000),
    (8, 8, 1753116800, 1753131200, 150.00, 14000, 14000),
    (9, 9, 1749574800, 1749589200, 220.00, 1800, 1800),
    (10, 10, 1751649600, 1751664000, 45.00, 2200, 2200),
    (11, 24, 1751130000, 1751144400, 110.00, 95000, 95000),
    (12, 13, 1748451600, 1748466000, 85.00, 18000, 18000),
    (13, 9, 1748797200, 1748811600, 40.00, 2200, 2200),
    (14, 23, 1724889600, 1726099200, 30.00, 1800, 1800),
    (15, 25, 1782230400, 1782258000, 60.00, 30000, 30000),
    (16, 7, 1747329600, 1747344000, 85.00, 12000, 12000),
    (17, 26, 1752080000, 1752861600, 45.00, 8000, 8000),
    (18, 7, 1755208800, 1755223200, 50.00, 10000, 10000),
    (19, 8, 1748278800, 1753548800, 12.00, 2000, 2000),
    (20, 18, 1746724800, 1746739200, 250.00, 500, 500),
    (21, 7, 1750007600, 1750022000, 50.00, 12000, 12000),
    (22, 3, 1748364400, 1748378800, 55.00, 14000, 14000),
    (23, 13, 1751044800, 1751059200, 60.00, 18000, 18000),
    (24, 9, 1751649600, 1751664000, 45.00, 2200, 2200),
    (25, 22, 1749229200, 1749400800, 180.00, 800, 800)
  `);

  // Partecipation
 
  db.run(`INSERT INTO Partecipation (artistID, eventID, role) VALUES
    (1, 1, "Artista principale"),
    (2, 2, "Artista principale"),
    (3, 3, "Artista principale"),
    (7, 4, "Artista espositore"),
    (11, 5, "Artista espositore"),
    (9, 6, "Attore protagonista"),
    (5, 7, "Autore e narratore"),
    (4, 8, "Ballerino principale e direttore artistico"),
    (22, 8, "Ospite speciale"),
    (12, 9, "Compagnia teatrale e orchestra"),
    (16, 10, "Presentatore"),
    (10, 10, "Ospite musicale"),
    (20, 10, "Ospite musicale"),
    (21, 10, "Ospite musicale"),
    (10, 11, "Artista principale"),
    (6, 12, "Artista principale"),
    (15, 12, "Ospite speciale"),
    (8, 13, "Compagnia teatrale"),
    (17, 14, "Regista ospite"),
    (13, 15, "Artista principale"),
    (10, 15, "Ospite speciale"),
    (20, 15, "Ospite speciale"),
    (14, 16, "Compagnia circense"),
    (15, 17, "Artista principale"),
    (6, 17, "Ospite speciale"),
    (16, 18, "Artista principale"),
    (17, 19, "Regista e curatore"),
    (18, 20, "Chef e docente"),
    (20, 21, "Artista principale"),
    (21, 22, "Artista principale"),
    (22, 23, "Artista principale"),
    (22, 24, "Artista principale"),
    (17, 25, "Ospite e relatore"),
    (11, 25, "Ospite e relatrice")
  `);

  console.log('Popolamento completato!');
});

db.close();