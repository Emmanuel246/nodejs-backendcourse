const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);

router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout);

module.exports = router;

