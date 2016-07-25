'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  eventId: String,
  username: String,
  place: String,
  imgUrl: String,
  venueAddress: String,
  date: String
});

module.exports = mongoose.model('Events', EventSchema);