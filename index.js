require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

const port = process.env.PORT || 5500;

const hbs = exphbs.create({
	extname: ".hbs"
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(function (req, res, next) {
	res.set({
		"Cache-Control": "no-cache, no-store, must-revalidate",
		Pragma: "no-cache",
		Expires: "0"
	});
	next();
});

const ClientManager = require("./src/ClientManager.js");
const cm = new ClientManager();

app.post("/api/vote", require("./src/actions/vote.js")(cm));
app.get("/api/getData", require("./src/actions/getData.js")(cm));

app.get("/", (req, res) => {
	(async function () {
		return await cm.getData();
	})().then(data => {
		res.render("home", {
			cptzeroVotes: data[0].votes,
			infinitusVotes: data[1].votes
		});
	});
});

app.use(express.static("public"));

app.use((req, res) => {
	res.sendStatus(404);
});

app.listen(port, function () {
	console.log("App listening on port " + port);
});
