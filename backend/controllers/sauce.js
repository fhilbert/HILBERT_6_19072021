const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.sauceCheck = (req, res, next) => {
	// userId
	let myRegex = /[a-z0-9]/gi;
	if (req.body.userId === "") return res.status(405).json({ error: "userId vide" });
	//	if (!req.body.userId.match(myRegex)) return res.status(405).json({ error: "userId non valide" });
	//verifier existence du userid

	// name
	if (req.body.name === "") return res.status(405).json({ error: "name vide" });
	myRegex = /[a-z0-9]/gi;
	// if (!req.body.name.match(myRegex)) return res.status(405).json({ error: "name invalide" });

	// manufacturer
	if (req.body.manufacturer === "") return res.status(405).json({ error: "manufacturer vide" });
	myRegex = /[a-z0-9]/gi;
	// if (!req.body.manufacturer.match(myRegex)) return res.status(405).json({ error: "manufacturer invalide" });

	// description
	if (req.body.description === "") return res.status(405).json({ error: "description vide" });
	myRegex = /[a-z0-9]/gi;
	// if (req.body.description.match(myRegex)) return res.status(405).json({ error: "description invalide" });

	// mainPepper
	if (req.body.mainPepper === "") return res.status(405).json({ error: "mainPepper vide" });
	myRegex = /[a-z0-9]/gi;
	// if (req.body.mainPepper.match(myRegex)) return res.status(405).json({ error: "mainPepper invalide" });

	// imageUrl
	if (req.body.imageUrl === "") return res.status(405).json({ error: "imageUrl vide" });

	// heat
	if (req.body.heat === "") return res.status(405).json({ error: "heat vide" });
	myRegex = /[0-9]/gi;
	// if (req.body.heat.match(myRegex)) return res.status(405).json({ error: "heat invalide" });

	// likes
	if (req.body.likes === "") return res.status(405).json({ error: "likes vide" });
	myRegex = /[0-9]/gi;
	// if (req.body.likes === "") return res.status(405).json({ error: "likes invalide" });

	// dislikes
	if (req.body.dislikes === "") return res.status(405).json({ error: "dislikes vide" });
	myRegex = /[0-9]/gi;
	// if (req.body.dislikes === "") return res.status(405).json({ error: "dislikes invalide" });

	// usersLiked
	if (req.body.userId === "") return res.status(405).json({ error: "userId vide" });
	//verifier existence du userid

	// usersDisliked
	if (req.body.userId === "") return res.status(405).json({ error: "userId vide" });
	//verifier existence du userid

	next();
};

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);

	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Objet crée" }))
		.catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			const filename = sauce.imageUrl.split("/images/")[1];
			console.log("filename : " + filename);
			fs.unlink(`images/${filename}`, err => {
				if (err) throw err;
				console.log("unlink img");
			});
		})
		.catch(error => res.status(500).json({ error }));

	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };

	console.log("reqfile : " + req.file);

	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Objet modifié !" }))
		.catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			const filename = sauce.imageUrl.split("/images/")[1];

			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Objet supprimé !" }))
					.catch(error => res.status(400).json({ error }));
			});
		})
		.catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			res.status(200).json(sauce);
			console.log(sauce.likes);
		})
		.catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
	console.log("sauce " + Sauce.find());
	Sauce.find()
		.then(sauce => res.status(200).json(sauce))

		.catch(error => console.log(error));
};
exports.dealLike = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			console.log("sauces.likes " + sauce.likes);
			// traitement de la valeur du like
			if (req.body.like === 1) {
				sauce.likes += 1;
				sauce.usersLiked.push(req.body.userId);

				console.log("traitement " + req.body.like);
				// traitement du 1
			} else {
				if (req.body.like === 0) {
					console.log("traitement " + req.body.like);
					sauce.usersLiked.forEach((userId, index) => {
						if (sauce.usersLiked[index] === req.body.userId) {
							sauce.usersLiked.splice(index, 1);
							sauce.likes -= 1;
						}
					});
					sauce.usersDisliked.forEach((userId, index) => {
						if (sauce.usersDisliked[index] === req.body.userId) {
							sauce.usersDisliked.splice(index, 1);
							sauce.dislikes -= 1;
						}
					});

					// traitement du 0
				} else if (req.body.like === -1) {
					sauce.dislikes += 1;
					sauce.usersDisliked.push(req.body.userId);
					console.log("disliked " + sauce.usersDisliked + " " + req.body.userId);
					console.log(typeof sauce.usersDisliked);
					console.log("traitement " + req.body.like);
					// traitement du -1
				}
			}
			// update likes
			console.log("---------------------------------------------");
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					$set: {
						likes: sauce.likes,
						dislikes: sauce.dislikes,
						usersLiked: sauce.usersLiked,
						usersDisliked: sauce.usersDisliked,
					},
				}
			)
				.then(() => res.status(200).json({ message: "Objet modifié !" }))
				.catch(error => res.status(400).json({ error }));
			console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
		})
		.catch(error => res.status(404).json({ error }));
	console.log("***********************************************");
};
