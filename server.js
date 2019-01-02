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
		dns.lookup(url.replace("https://", "").replace("http://", ""), (err) => {
			if (err) {
				res.json({ error: "invalid URL" });
				return next(err);
			}
			ShortUrl.create({ original_url: url}, function(err, short_url){
				if(err) {
					res.json({error: "Error while shortening url."});
					return next(err);
				}
				let obj = {original_url: url, short_url: short_url.short_url};
				res.json(obj);
				return next();
			});	
		})
	} else {
		res.json({ error: "invalid URL" });
	}
});

app.get("/api/shorturl/:id", (req, res, next)=>{
	const id = req.params.id;
	if(!isNaN(id)) {
		ShortUrl.findOne({short_url: id}, '-_id')
		.then((url)=>{
			const treated_url = "http://" + url.original_url.replace("htpp://","").replace("https://", "");
			res.redirect(treated_url);
			return next();
		})	
		.catch((err)=>{
			res.json(404, {error: "Id not found."});
			return next(err);
		});
	} else {
		res.json(404, {error: "Id is not a number."})
		return next();
	}
});

app.get("/api/shorturl/", (req, res, next) =>{
	ShortUrl.find({}, "-_id -__v").then((shorturls) =>{
		res.json(shorturls);
		return next();
	})
	.catch((err)=>{
		res.json(404, {error: "Error while finding urls."});
		return next(err);
	})
});

app.listen(port, function () {
	console.log('Node.js listening ...');
});