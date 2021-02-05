const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, MAIL_API } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: MAIL_API,
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

router.post("/reset-password", (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
		}
		const token = buffer.toString("hex");
		User.findOne({ email: req.body.email }).then((user) => {
			if (!user) {
				return res
					.status(422)
					.json({ error: "User don't exist with such email." });
			}
			user.resetToken = token;
			user.expireToken = Date.now() + 3600000;
			user.save().then((result) => {
				transporter.sendMail({
					to: user.email,
					from: "amaharjan1033@gmail.com",
					subject: "password reset",
					html: `
					<p>You requested for password reset.</p>
					<h5>Click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
					`,
				});
				res.json({ message: "Please check your email." });
			});
		});
	});
});

module.exports = router;
