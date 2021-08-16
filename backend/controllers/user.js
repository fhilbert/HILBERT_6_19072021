const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CryptoJS = require("crypto-js");

const key = process.env.CRYPTKEY;
const keyutf = CryptoJS.enc.Utf8.parse(key);
const iv = CryptoJS.enc.Base64.parse(key);

const User = require("../models/User");
// validation
exports.userCheck = (req, res, next) => {
	// user
	if (req.body.email === "") return res.status(405).json({ error: "email vide" });
	const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (!req.body.email.match(mailFormat)) {
		return res.status(405).json({ error: "email invalide" });
	}
	// password
	if (req.body.password === "") {
		return res.status(405).json({ error: "Mot de passe vide" });
	}
	const pswdFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
	if (!req.body.password.match(pswdFormat)) {
		return res.status(405).json({ error: "Mot de passe invalide" });
	}

	next();
};

exports.signup = (req, res, next) => {
	console.log("signup");
	const enc = CryptoJS.AES.encrypt(req.body.email, keyutf, { iv: iv });
	const encMail = enc.toString();
	bcrypt
		.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				email: encMail,
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
	const enc = CryptoJS.AES.encrypt(req.body.email, keyutf, { iv: iv });
	const encMail = enc.toString();

	User.findOne({ email: encMail })
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
