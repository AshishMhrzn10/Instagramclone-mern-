const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
// 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

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key:
				"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",
		},
	})
);

router.post("/signup", (req, res) => {
	const { name, email, password, pic } = req.body;
	if (!email || !password || !name) {
		return res.status(422).json({ error: "Please add all the fields" });
	}
	User.findOne({ email: email })
		.then((savedUser) => {
			if (savedUser) {
				return res.status(422).json({ error: "Email already exists" });
			}
			bcrypt.hash(password, 12).then((hashedpassword) => {
				const user = new User({
					email,
					password: hashedpassword,
					name,
					pic,
				});
				user
					.save()
					.then((user) => {
						transporter.sendMail({
							to: user.email,
							from: "amaharjan1033@gmail.com",
							subject: "Signup success",
							html: "<h1>Welcome to instagram</h1>",
						});
						res.json({ message: "saved successfully" });
					})
					.catch((err) => {
						console.log(err);
					});
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post("/signin", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(422).json({ error: "Please provide all the fields" });
	}
	User.findOne({ email: email })
		.then((savedUser) => {
			if (!savedUser) {
				return res.status(422).json({ error: "Invalid credentials" });
			}
			bcrypt.compare(password, savedUser.password).then((doMatch) => {
				if (doMatch) {
					// res.json({ message: "Successfully signed in" });
					const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
					const { _id, name, email, followers, following, pic } = savedUser;
					res.json({
						token,
						user: { _id, name, email, followers, following, pic },
					});
				} else {
					return res.status(422).json({ error: "Invalid credentials" });
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
