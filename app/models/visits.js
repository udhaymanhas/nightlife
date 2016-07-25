'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitsSchema = new Schema({
  eventId: String,
  username: String,
  place: String,
  imgUrl: String,
  venueAddress: String,
  date: String
});

module.exports = mongoose.model('Visits', VisitsSchema);