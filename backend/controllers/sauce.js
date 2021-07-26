const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	console.log("------");
	console.log(sauceObject);
	console.log("------");
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});
	console.log("*****");
	console.log("sauce" + sauce);
	console.log("*****");

	// Sauce.insertOne(sauce)
	// 	.then(() => res.status(201).json({ message: "Objet crée" }))
	// 	.catch(error => res.status(400).json({ error }));
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Objet crée" }))
		.catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };
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
		.then(sauce => {
			res.status(200).json(sauce);
		})

		.catch(error => console.log(error));
};
exports.dealLike = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			res.status(200).json(sauce);
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
						//console.log("like =0 " + index + " " + sauce.usersLiked[index] + " " + req.body.userId);
						if (sauce.usersLiked[index] === req.body.userId) {
							sauce.usersLiked.splice(index, 1);
							sauce.likes -= 1;
						}
					});
					sauce.usersDisliked.forEach((userId, index) => {
						//console.log("like =0 " + index + " " + sauce.usersDisliked[index] + " " + req.body.userId);
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
		})
		.catch(error => res.status(404).json({ error }));
};
