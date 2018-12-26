'use strict';

var express = require('express');
var mongoose = require('mongoose');
import bodyParser from 'body-parser'
require('dotenv').config();

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI);

let ShortUrl = new mongoose.Schema({
	original_url: {
		type: String,
		required: true
	},
	short_url: {
		type: Number,
		required: true
	}
});

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/shorturl/new", (req, res, next) => {

});

app.listen(port, function () {
  console.log('Node.js listening ...');
});