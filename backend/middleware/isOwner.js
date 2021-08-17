const jwt = require("jsonwebtoken");
const Sauce = require("../models/Sauce");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const tokenkey = process.env.TOKENKEY;
		const decodedToken = jwt.verify(token, tokenkey);
		const userId = decodedToken.userId;

		Sauce.findOne({ _id: req.params.id })
			.then(sauce => {
				if (sauce.userId === userId) {
					next();
				} else {
					throw "UserId non autorisé";
				}
			})
			.catch(error => res.status(403).json({ error }));
	} catch (error) {
		res.status(401).json({ error: error | "Requête non authentifiée !" });
	}
};
