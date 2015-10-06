'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ac = mongoose.model('Ac'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ac;

/**
 * Ac routes tests
 */
describe('Ac CRUD tests', function() {
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

		// Save a user to the test db and create new Ac
		user.save(function() {
			ac = {
				name: 'Ac Name'
			};

			done();
		});
	});

	it('should be able to save Ac instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ac
				agent.post('/acs')
					.send(ac)
					.expect(200)
					.end(function(acSaveErr, acSaveRes) {
						// Handle Ac save error
						if (acSaveErr) done(acSaveErr);

						// Get a list of Acs
						agent.get('/acs')
							.end(function(acsGetErr, acsGetRes) {
								// Handle Ac save error
								if (acsGetErr) done(acsGetErr);

								// Get Acs list
								var acs = acsGetRes.body;

								// Set assertions
								(acs[0].user._id).should.equal(userId);
								(acs[0].name).should.match('Ac Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ac instance if not logged in', function(done) {
		agent.post('/acs')
			.send(ac)
			.expect(401)
			.end(function(acSaveErr, acSaveRes) {
				// Call the assertion callback
				done(acSaveErr);
			});
	});

	it('should not be able to save Ac instance if no name is provided', function(done) {
		// Invalidate name field
		ac.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ac
				agent.post('/acs')
					.send(ac)
					.expect(400)
					.end(function(acSaveErr, acSaveRes) {
						// Set message assertion
						(acSaveRes.body.message).should.match('Please fill Ac name');
						
						// Handle Ac save error
						done(acSaveErr);
					});
			});
	});

	it('should be able to update Ac instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ac
				agent.post('/acs')
					.send(ac)
					.expect(200)
					.end(function(acSaveErr, acSaveRes) {
						// Handle Ac save error
						if (acSaveErr) done(acSaveErr);

						// Update Ac name
						ac.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ac
						agent.put('/acs/' + acSaveRes.body._id)
							.send(ac)
							.expect(200)
							.end(function(acUpdateErr, acUpdateRes) {
								// Handle Ac update error
								if (acUpdateErr) done(acUpdateErr);

								// Set assertions
								(acUpdateRes.body._id).should.equal(acSaveRes.body._id);
								(acUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Acs if not signed in', function(done) {
		// Create new Ac model instance
		var acObj = new Ac(ac);

		// Save the Ac
		acObj.save(function() {
			// Request Acs
			request(app).get('/acs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ac if not signed in', function(done) {
		// Create new Ac model instance
		var acObj = new Ac(ac);

		// Save the Ac
		acObj.save(function() {
			request(app).get('/acs/' + acObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ac.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ac instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ac
				agent.post('/acs')
					.send(ac)
					.expect(200)
					.end(function(acSaveErr, acSaveRes) {
						// Handle Ac save error
						if (acSaveErr) done(acSaveErr);

						// Delete existing Ac
						agent.delete('/acs/' + acSaveRes.body._id)
							.send(ac)
							.expect(200)
							.end(function(acDeleteErr, acDeleteRes) {
								// Handle Ac error error
								if (acDeleteErr) done(acDeleteErr);

								// Set assertions
								(acDeleteRes.body._id).should.equal(acSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ac instance if not signed in', function(done) {
		// Set Ac user 
		ac.user = user;

		// Create new Ac model instance
		var acObj = new Ac(ac);

		// Save the Ac
		acObj.save(function() {
			// Try deleting Ac
			request(app).delete('/acs/' + acObj._id)
			.expect(401)
			.end(function(acDeleteErr, acDeleteRes) {
				// Set message assertion
				(acDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ac error error
				done(acDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ac.remove().exec();
		done();
	});
});