'use strict';

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const dns = require('dns');
const ShortUrl = require('./shortUrl');

require('dotenv').config();

const cors = require('cors');

const app = express();
// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
	res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl/new", (req, res, next) => {
	const url = req.body.url;
	if (url) {
		dns.lookup(url, (err) => {
			if (err) {
				res.json({ error: "invalid URL" });
				return next(err);
			}
			const short_url = new ShortUrl({ original_url: ''});
			short_url.save();
			res.json(short_url);
			return next();
		})
	} else {
		res.json({ error: "invalid URL" });
	}
});

app.listen(port, function () {
	console.log('Node.js listening ...');
});