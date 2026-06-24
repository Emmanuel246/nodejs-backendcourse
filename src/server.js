const express = require("express");
const { config } = require("dotenv");
const { connectDB, disconnectDB } = require("./config/db");

// Import Routes
const movieRoutes = require("./routes/movieRoute");
const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

config();
connectDB();

const app = express();

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);
const PORT = 5001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port" ${PORT}`);
});

// Handle unhandled promise rejections (e.g database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection: ", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.log("Uncaught Exception: ", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM. received, shutting down gracefully");
  server.close(async () => {
    process.exit(1);
  });
});
