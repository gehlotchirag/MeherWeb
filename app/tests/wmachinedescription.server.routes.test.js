'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wmachinedescription = mongoose.model('Wmachinedescription'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, wmachinedescription;

/**
 * Wmachinedescription routes tests
 */
describe('Wmachinedescription CRUD tests', function() {
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

		// Save a user to the test db and create new Wmachinedescription
		user.save(function() {
			wmachinedescription = {
				name: 'Wmachinedescription Name'
			};

			done();
		});
	});

	it('should be able to save Wmachinedescription instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wmachinedescription
				agent.post('/wmachinedescriptions')
					.send(wmachinedescription)
					.expect(200)
					.end(function(wmachinedescriptionSaveErr, wmachinedescriptionSaveRes) {
						// Handle Wmachinedescription save error
						if (wmachinedescriptionSaveErr) done(wmachinedescriptionSaveErr);

						// Get a list of Wmachinedescriptions
						agent.get('/wmachinedescriptions')
							.end(function(wmachinedescriptionsGetErr, wmachinedescriptionsGetRes) {
								// Handle Wmachinedescription save error
								if (wmachinedescriptionsGetErr) done(wmachinedescriptionsGetErr);

								// Get Wmachinedescriptions list
								var wmachinedescriptions = wmachinedescriptionsGetRes.body;

								// Set assertions
								(wmachinedescriptions[0].user._id).should.equal(userId);
								(wmachinedescriptions[0].name).should.match('Wmachinedescription Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Wmachinedescription instance if not logged in', function(done) {
		agent.post('/wmachinedescriptions')
			.send(wmachinedescription)
			.expect(401)
			.end(function(wmachinedescriptionSaveErr, wmachinedescriptionSaveRes) {
				// Call the assertion callback
				done(wmachinedescriptionSaveErr);
			});
	});

	it('should not be able to save Wmachinedescription instance if no name is provided', function(done) {
		// Invalidate name field
		wmachinedescription.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wmachinedescription
				agent.post('/wmachinedescriptions')
					.send(wmachinedescription)
					.expect(400)
					.end(function(wmachinedescriptionSaveErr, wmachinedescriptionSaveRes) {
						// Set message assertion
						(wmachinedescriptionSaveRes.body.message).should.match('Please fill Wmachinedescription name');
						
						// Handle Wmachinedescription save error
						done(wmachinedescriptionSaveErr);
					});
			});
	});

	it('should be able to update Wmachinedescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wmachinedescription
				agent.post('/wmachinedescriptions')
					.send(wmachinedescription)
					.expect(200)
					.end(function(wmachinedescriptionSaveErr, wmachinedescriptionSaveRes) {
						// Handle Wmachinedescription save error
						if (wmachinedescriptionSaveErr) done(wmachinedescriptionSaveErr);

						// Update Wmachinedescription name
						wmachinedescription.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Wmachinedescription
						agent.put('/wmachinedescriptions/' + wmachinedescriptionSaveRes.body._id)
							.send(wmachinedescription)
							.expect(200)
							.end(function(wmachinedescriptionUpdateErr, wmachinedescriptionUpdateRes) {
								// Handle Wmachinedescription update error
								if (wmachinedescriptionUpdateErr) done(wmachinedescriptionUpdateErr);

								// Set assertions
								(wmachinedescriptionUpdateRes.body._id).should.equal(wmachinedescriptionSaveRes.body._id);
								(wmachinedescriptionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Wmachinedescriptions if not signed in', function(done) {
		// Create new Wmachinedescription model instance
		var wmachinedescriptionObj = new Wmachinedescription(wmachinedescription);

		// Save the Wmachinedescription
		wmachinedescriptionObj.save(function() {
			// Request Wmachinedescriptions
			request(app).get('/wmachinedescriptions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Wmachinedescription if not signed in', function(done) {
		// Create new Wmachinedescription model instance
		var wmachinedescriptionObj = new Wmachinedescription(wmachinedescription);

		// Save the Wmachinedescription
		wmachinedescriptionObj.save(function() {
			request(app).get('/wmachinedescriptions/' + wmachinedescriptionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', wmachinedescription.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Wmachinedescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wmachinedescription
				agent.post('/wmachinedescriptions')
					.send(wmachinedescription)
					.expect(200)
					.end(function(wmachinedescriptionSaveErr, wmachinedescriptionSaveRes) {
						// Handle Wmachinedescription save error
						if (wmachinedescriptionSaveErr) done(wmachinedescriptionSaveErr);

						// Delete existing Wmachinedescription
						agent.delete('/wmachinedescriptions/' + wmachinedescriptionSaveRes.body._id)
							.send(wmachinedescription)
							.expect(200)
							.end(function(wmachinedescriptionDeleteErr, wmachinedescriptionDeleteRes) {
								// Handle Wmachinedescription error error
								if (wmachinedescriptionDeleteErr) done(wmachinedescriptionDeleteErr);

								// Set assertions
								(wmachinedescriptionDeleteRes.body._id).should.equal(wmachinedescriptionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Wmachinedescription instance if not signed in', function(done) {
		// Set Wmachinedescription user 
		wmachinedescription.user = user;

		// Create new Wmachinedescription model instance
		var wmachinedescriptionObj = new Wmachinedescription(wmachinedescription);

		// Save the Wmachinedescription
		wmachinedescriptionObj.save(function() {
			// Try deleting Wmachinedescription
			request(app).delete('/wmachinedescriptions/' + wmachinedescriptionObj._id)
			.expect(401)
			.end(function(wmachinedescriptionDeleteErr, wmachinedescriptionDeleteRes) {
				// Set message assertion
				(wmachinedescriptionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Wmachinedescription error error
				done(wmachinedescriptionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Wmachinedescription.remove().exec();
		done();
	});
});