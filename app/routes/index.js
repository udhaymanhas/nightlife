'use strict';

var path = process.cwd();

module.exports = function (app, passport) {
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.post('/api/events', function (req, res) {
		    require('../controller/events.controller').newEvent(req, res);
		});
		
	app.get('/api/events/:username', function (req, res) {
		    require('../controller/events.controller').checkGoing(req, res);
		});
		
	app.delete('/api/events/:username/:id', function (req, res) {
	    require('../controller/events.controller').deleteGoing(req, res);
	});
		
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
    
    app.route('/*')
        .get(function(req, res) {
            res.sendFile(path + '/public/index.html');
    });

};
