const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const { MONGOURI } = require("./keys");

mongoose.connect(MONGOURI, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on("connected", () => {
	console.log("Connected to mongodb");
});

mongoose.connection.on("error", (err) => {
	console.log("Error connecting", err);
});

app.listen(PORT, () => {
	console.log("Server is running on", PORT);
});
