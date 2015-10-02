'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Packetfood = mongoose.model('Packetfood'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, packetfood;

/**
 * Packetfood routes tests
 */
describe('Packetfood CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Packetfood
		user.save(function() {
			packetfood = {
				name: 'Packetfood Name'
			};

			done();
		});
	});

	it('should be able to save Packetfood instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Packetfood
				agent.post('/packetfoods')
					.send(packetfood)
					.expect(200)
					.end(function(packetfoodSaveErr, packetfoodSaveRes) {
						// Handle Packetfood save error
						if (packetfoodSaveErr) done(packetfoodSaveErr);

						// Get a list of Packetfoods
						agent.get('/packetfoods')
							.end(function(packetfoodsGetErr, packetfoodsGetRes) {
								// Handle Packetfood save error
								if (packetfoodsGetErr) done(packetfoodsGetErr);

								// Get Packetfoods list
								var packetfoods = packetfoodsGetRes.body;

								// Set assertions
								(packetfoods[0].user._id).should.equal(userId);
								(packetfoods[0].name).should.match('Packetfood Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Packetfood instance if not logged in', function(done) {
		agent.post('/packetfoods')
			.send(packetfood)
			.expect(401)
			.end(function(packetfoodSaveErr, packetfoodSaveRes) {
				// Call the assertion callback
				done(packetfoodSaveErr);
			});
	});

	it('should not be able to save Packetfood instance if no name is provided', function(done) {
		// Invalidate name field
		packetfood.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Packetfood
				agent.post('/packetfoods')
					.send(packetfood)
					.expect(400)
					.end(function(packetfoodSaveErr, packetfoodSaveRes) {
						// Set message assertion
						(packetfoodSaveRes.body.message).should.match('Please fill Packetfood name');
						
						// Handle Packetfood save error
						done(packetfoodSaveErr);
					});
			});
	});

	it('should be able to update Packetfood instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Packetfood
				agent.post('/packetfoods')
					.send(packetfood)
					.expect(200)
					.end(function(packetfoodSaveErr, packetfoodSaveRes) {
						// Handle Packetfood save error
						if (packetfoodSaveErr) done(packetfoodSaveErr);

						// Update Packetfood name
						packetfood.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Packetfood
						agent.put('/packetfoods/' + packetfoodSaveRes.body._id)
							.send(packetfood)
							.expect(200)
							.end(function(packetfoodUpdateErr, packetfoodUpdateRes) {
								// Handle Packetfood update error
								if (packetfoodUpdateErr) done(packetfoodUpdateErr);

								// Set assertions
								(packetfoodUpdateRes.body._id).should.equal(packetfoodSaveRes.body._id);
								(packetfoodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Packetfoods if not signed in', function(done) {
		// Create new Packetfood model instance
		var packetfoodObj = new Packetfood(packetfood);

		// Save the Packetfood
		packetfoodObj.save(function() {
			// Request Packetfoods
			request(app).get('/packetfoods')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Packetfood if not signed in', function(done) {
		// Create new Packetfood model instance
		var packetfoodObj = new Packetfood(packetfood);

		// Save the Packetfood
		packetfoodObj.save(function() {
			request(app).get('/packetfoods/' + packetfoodObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', packetfood.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Packetfood instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Packetfood
				agent.post('/packetfoods')
					.send(packetfood)
					.expect(200)
					.end(function(packetfoodSaveErr, packetfoodSaveRes) {
						// Handle Packetfood save error
						if (packetfoodSaveErr) done(packetfoodSaveErr);

						// Delete existing Packetfood
						agent.delete('/packetfoods/' + packetfoodSaveRes.body._id)
							.send(packetfood)
							.expect(200)
							.end(function(packetfoodDeleteErr, packetfoodDeleteRes) {
								// Handle Packetfood error error
								if (packetfoodDeleteErr) done(packetfoodDeleteErr);

								// Set assertions
								(packetfoodDeleteRes.body._id).should.equal(packetfoodSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Packetfood instance if not signed in', function(done) {
		// Set Packetfood user 
		packetfood.user = user;

		// Create new Packetfood model instance
		var packetfoodObj = new Packetfood(packetfood);

		// Save the Packetfood
		packetfoodObj.save(function() {
			// Try deleting Packetfood
			request(app).delete('/packetfoods/' + packetfoodObj._id)
			.expect(401)
			.end(function(packetfoodDeleteErr, packetfoodDeleteRes) {
				// Set message assertion
				(packetfoodDeleteRes.body.message).should.match('User is not logged in');

				// Handle Packetfood error error
				done(packetfoodDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Packetfood.remove().exec();
		done();
	});
});