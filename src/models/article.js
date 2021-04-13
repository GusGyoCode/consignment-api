'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
  ci: String,
  name: String,
  cibank: String,
  bank: String,
  namebank: String,
  numberbank: String,
  typebank: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', ArticleSchema);