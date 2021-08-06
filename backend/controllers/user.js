const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
// validation
exports.userCheck = (req, res, next) => {
	// user
	if (req.body.email === "") return res.status(405).json({ error: "email vide" });
	const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (!req.body.email.match(mailformat)) {
		return res.status(405).json({ error: "email invalide" });
	}

	// password
	if (req.body.password === "") {
		return res.status(405).json({ error: "Mot de passe vide" });
	}
	next();
};

exports.signup = (req, res, next) => {
	console.log("signup");
	bcrypt
		.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user
				.save()
				.then(() => res.status(201).json({ message: "Utilisateur crée !" }))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(error => res.status(503).json({ error }));
};
exports.login = (req, res, next) => {
	const tokenkey = process.env.TOKENKEY;
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then(valid => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, tokenkey, { expiresIn: "24h" }),
					});
				})
				.catch(error => res.status(501).json({ error }));
		})
		.catch(error => res.status(502).json({ error }));
};
