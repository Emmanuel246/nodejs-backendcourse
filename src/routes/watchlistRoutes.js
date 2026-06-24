const express = require("express");
const  addToWatchlist  = require("../controllers/watchlistController");
const authMiddleware = require("../middleware/authMiddleware");
const { addToWatchlistSchema } = require("../validators/watchlistValidators");

const router = express.Router();

router.use(authMiddleware)

router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);

router.put("/:id", updatewatchlistItem);

router.delete("/:id", reomoveFromWatchlist);
module.exports = router;

