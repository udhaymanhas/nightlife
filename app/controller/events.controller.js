'use strict';

var Events = require('../models/events');
var Visits = require('../models/visits');

exports.newEvent = function(req, res) {
    Events.findOne({'eventId': req.body.eventId, 'username': req.body.username}, function (err, event) {
        if(err) { throw err; } 
        
        if(event){
            res.json("Added");
        }
        else{
            
            var newEvent = new Events();
            
            newEvent.eventId = req.body.eventId;
            newEvent.username = req.body.username; 
            newEvent.place = req.body.place;
            newEvent.imgUrl = req.body.imgUrl;
            newEvent.venueAddress = req.body.venueAddress;
            newEvent.date = req.body.date;
            
            newEvent.save(function (err, result) {
            if(err) { throw err; }
                // res.json(result);
            });
            
            
            var visits = new Visits();
            visits.eventId = req.body.eventId;
            visits.username = req.body.username; 
            visits.place = req.body.place;
            visits.imgUrl = req.body.imgUrl;
            visits.venueAddress = req.body.venueAddress;
            visits.date = req.body.date;
            
            visits.save(function(err,result){
                if(err) {throw err;}
                    res.json(result);
            });
        }
    });
};

exports.checkGoing = function(req, res) {
    Events.find({'username': req.params.username},{_id:0, __v:0}, function (err, event) {
        if(err) {throw err;}
        res.json(event);
    });
}

exports.deleteGoing = function(req, res) {
    console.log('-------->');
    Events.findOne({'username': req.params.username, 'eventId':req.params.id}, function (err, event) {
        if(err) {throw err;}
        event.remove(function(err){
            if(err) {throw err;}
             res.json(event);
        })
    });
}