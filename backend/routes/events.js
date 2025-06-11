const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", async (req, res) => {

    try {
        const popularEvents = await Event.getPopularEvents();
        const upcomingEvents = await Event.getUpcomingEvents();

        res.status(200).json({
            success: true,
            popularEvents: popularEvents,
            upComingEvents: upcomingEvents,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero degli eventi",
        });
    }

})

router.get('/event-info/:eventID', async (req, res) => {
    const eventID = req.params.eventID;

    try {
        const event = await Event.getEventByID(eventID);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Evento non trovato",
            });
        }

        res.status(200).json({
            success: true,
            event: event,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero delle informazioni dell'evento",
        });
    }
}
)

router.get("/categories", async (req, res) => {
    try {
        const categories = await Event.getCategories();

        res.status(200).json({
            success: true,
            categories: categories,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero delle categorie",
        });
    }

})

router.get("/get-reviews/:showID", async (req, res) => {
    const showID = req.params.showID;
    console.log(showID);

    try {
        const reviews = await Event.getReviewsByShowID(showID);

        res.status(200).json({
            success: true,
            reviews: reviews,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero delle recensioni",
        });
    }
}
)

router.get("/search", async (req, res) => {
    const { location, title, minPrice, maxPrice, date, category } = req.query;
    console.log(req.query)

    try {
        
        const searchParams = {
            location,
            title,
            minPrice,
            maxPrice,
            date,
            category,
        };
        
        const events = await Event.searchEvents(searchParams);
        
        res.status(200).json({
            success: true,
            events: events,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero degli eventi",
        });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const events = await Event.getEventDetails(req.params.id);
        res.status(200).json({
            success: true,
            events: events,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero degli eventi",
        });
    }

})

router.get("/:id/artists", async (req, res) => {
    try {
        const artists = await Event.getEventArtists(req.params.id);
        res.status(200).json({
            success: true,
            artists: artists,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero degli artisti",
        });
    }
})


router.get("/category/:category", async (req, res) => {
    const category = req.params.category;

    try {
        const events = await Event.getEventsByCategory(category);

        res.status(200).json({
            success: true,
            events: events,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero degli eventi",
        });
    }
})

router.post("/add-to-favorites", isAuthenticated, async (req, res) => {
    const { showID } = req.body;

    try {

        const isFavorite = await Event.isInFavorites(req.session.user.id, showID);

        if (isFavorite) {
            return res.status(400).json({
                success: false,
                message: "Evento già nei preferiti",
            });
        }

        await Event.addToFavorites(req.session.user.id, showID);

        res.status(200).json({
            success: true,
            message: "Evento aggiunto ai preferiti",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante l'aggiunta ai preferiti",
        });
    }
})

router.post("/remove-from-favorites", isAuthenticated, async (req, res) => {
    const { showID } = req.body;

    try {

        const isFavorite = await Event.isInFavorites(req.session.user.id, showID);

        if (!isFavorite) {
            return res.status(400).json({
                success: false,
                message: "Evento non nei preferiti",
            });
        }

        await Event.removeFromFavorites(req.session.user.id, showID);

        res.status(200).json({
            success: true,
            message: "Evento rimosso dai preferiti",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante la rimozione dai preferiti",
        });
    }
}
)

router.get("/search-by-show/:showID", async (req, res) => {
    const showID = req.params.showID;

    try {
        const event = await Event.getEventByShowID(showID);

        res.status(200).json({
            success: true,
            event: event,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore durante il recupero degli eventi",
        });
    }
}
)



module.exports = router;
