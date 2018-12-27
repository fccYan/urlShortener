const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ShortUrlSchema = new mongoose.Schema({
	original_url: {
		type: String,
		required: true
	}
});
ShortUrlSchema.plugin(AutoIncrement, {inc_field: 'short_url'});
module.exports = mongoose.model("ShortUrl", ShortUrlSchema);