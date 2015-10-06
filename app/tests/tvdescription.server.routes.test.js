'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tvdescription = mongoose.model('Tvdescription'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tvdescription;

/**
 * Tvdescription routes tests
 */
describe('Tvdescription CRUD tests', function() {
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

		// Save a user to the test db and create new Tvdescription
		user.save(function() {
			tvdescription = {
				name: 'Tvdescription Name'
			};

			done();
		});
	});

	it('should be able to save Tvdescription instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tvdescription
				agent.post('/tvdescriptions')
					.send(tvdescription)
					.expect(200)
					.end(function(tvdescriptionSaveErr, tvdescriptionSaveRes) {
						// Handle Tvdescription save error
						if (tvdescriptionSaveErr) done(tvdescriptionSaveErr);

						// Get a list of Tvdescriptions
						agent.get('/tvdescriptions')
							.end(function(tvdescriptionsGetErr, tvdescriptionsGetRes) {
								// Handle Tvdescription save error
								if (tvdescriptionsGetErr) done(tvdescriptionsGetErr);

								// Get Tvdescriptions list
								var tvdescriptions = tvdescriptionsGetRes.body;

								// Set assertions
								(tvdescriptions[0].user._id).should.equal(userId);
								(tvdescriptions[0].name).should.match('Tvdescription Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tvdescription instance if not logged in', function(done) {
		agent.post('/tvdescriptions')
			.send(tvdescription)
			.expect(401)
			.end(function(tvdescriptionSaveErr, tvdescriptionSaveRes) {
				// Call the assertion callback
				done(tvdescriptionSaveErr);
			});
	});

	it('should not be able to save Tvdescription instance if no name is provided', function(done) {
		// Invalidate name field
		tvdescription.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tvdescription
				agent.post('/tvdescriptions')
					.send(tvdescription)
					.expect(400)
					.end(function(tvdescriptionSaveErr, tvdescriptionSaveRes) {
						// Set message assertion
						(tvdescriptionSaveRes.body.message).should.match('Please fill Tvdescription name');
						
						// Handle Tvdescription save error
						done(tvdescriptionSaveErr);
					});
			});
	});

	it('should be able to update Tvdescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tvdescription
				agent.post('/tvdescriptions')
					.send(tvdescription)
					.expect(200)
					.end(function(tvdescriptionSaveErr, tvdescriptionSaveRes) {
						// Handle Tvdescription save error
						if (tvdescriptionSaveErr) done(tvdescriptionSaveErr);

						// Update Tvdescription name
						tvdescription.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tvdescription
						agent.put('/tvdescriptions/' + tvdescriptionSaveRes.body._id)
							.send(tvdescription)
							.expect(200)
							.end(function(tvdescriptionUpdateErr, tvdescriptionUpdateRes) {
								// Handle Tvdescription update error
								if (tvdescriptionUpdateErr) done(tvdescriptionUpdateErr);

								// Set assertions
								(tvdescriptionUpdateRes.body._id).should.equal(tvdescriptionSaveRes.body._id);
								(tvdescriptionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tvdescriptions if not signed in', function(done) {
		// Create new Tvdescription model instance
		var tvdescriptionObj = new Tvdescription(tvdescription);

		// Save the Tvdescription
		tvdescriptionObj.save(function() {
			// Request Tvdescriptions
			request(app).get('/tvdescriptions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tvdescription if not signed in', function(done) {
		// Create new Tvdescription model instance
		var tvdescriptionObj = new Tvdescription(tvdescription);

		// Save the Tvdescription
		tvdescriptionObj.save(function() {
			request(app).get('/tvdescriptions/' + tvdescriptionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tvdescription.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tvdescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tvdescription
				agent.post('/tvdescriptions')
					.send(tvdescription)
					.expect(200)
					.end(function(tvdescriptionSaveErr, tvdescriptionSaveRes) {
						// Handle Tvdescription save error
						if (tvdescriptionSaveErr) done(tvdescriptionSaveErr);

						// Delete existing Tvdescription
						agent.delete('/tvdescriptions/' + tvdescriptionSaveRes.body._id)
							.send(tvdescription)
							.expect(200)
							.end(function(tvdescriptionDeleteErr, tvdescriptionDeleteRes) {
								// Handle Tvdescription error error
								if (tvdescriptionDeleteErr) done(tvdescriptionDeleteErr);

								// Set assertions
								(tvdescriptionDeleteRes.body._id).should.equal(tvdescriptionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tvdescription instance if not signed in', function(done) {
		// Set Tvdescription user 
		tvdescription.user = user;

		// Create new Tvdescription model instance
		var tvdescriptionObj = new Tvdescription(tvdescription);

		// Save the Tvdescription
		tvdescriptionObj.save(function() {
			// Try deleting Tvdescription
			request(app).delete('/tvdescriptions/' + tvdescriptionObj._id)
			.expect(401)
			.end(function(tvdescriptionDeleteErr, tvdescriptionDeleteRes) {
				// Set message assertion
				(tvdescriptionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tvdescription error error
				done(tvdescriptionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tvdescription.remove().exec();
		done();
	});
});