const { user } = require('pg/lib/defaults.js');
const { prisma } = require('../config/db.js');

const addToWatchlist = async (req, res) => {
    const {movieId, status, rating, notes } = req.body;

    // verify if movie exists
    const movie = await prisma.movie.findUnique({
        where: {id: movieId},

    });

    if(!movie) {
        return res.status(404).json({error: "Movie not found"});

    }

    // Check if already added
        const existingWatchlist = await prisma.watchlistItem .findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,
                movieId: movieId,
            }, 
        },
    });

        if(existingWatchlist) {
        return res.status(400).json({error: "Movie is already in the watchlist"});

    }

    const watchlistItem = await prisma.watchlistItem.create({
        data: {
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating,
            notes,
        },
    });

    res.status(201).json({
        status: "Success",
        data: {
            watchlistItem
        }
    })
}


const updatewatchlistItem = async (req, res) => {
    const {status, rating, notes} = req.body;

    // Find Watchlist item and verify ownership
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: {id: req.params.id},
    });

    if (!watchlistItem) {
        return res.status(404).json({ error:  "Watchlist item not found" });
    }

    // Ensure only owner can update
    if (watchlistItem.userId !== req.user.id) {
        return res.status(403).json({erorr: "Not allowed to update this watchlist item"})
    }

    // Build update data
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    // Upddate Watchlist Item
        await prisma.watchlistItem.update({
        where: {id: req.params.id},
        data: updateData,
    });
    res.status(200).json({
        status: "success",
        message: "Movie updated for watchlist",
    })
}




const reomoveFromWatchlist = async (req, res) => {
    // Find watxhlist item and verify owernership
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: {id: req.params.id},
    });

    if (!watchlistItem) {
        return res.status(404).json({ error:  "Watchlist item not found" });
    }

    // Ensure only owner can delete
    if (watchlistItem.userId !== req.user.id) {
        return res.status(403).json({erorr: "Not allowed to update this watchlist item"})
    }

    await prisma.watchlistItem.delete({
        where: {id: req.params.id},
    });
    res.status(200).json({
        status: "success",
        message: "Movie Removed from watchlist",
    });
};

module.exports = {addToWatchlist, reomoveFromWatchlist, updatewatchlistItem}