const express = require("express");
const helmet = require("helmet");

const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

const accessmongodb = process.env.ACCESSMONGODB;

mongoose
	.connect(accessmongodb, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(err => console.log("Connexion à MongoDB échouée !" + err));

const app = express();

app.use(helmet());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
