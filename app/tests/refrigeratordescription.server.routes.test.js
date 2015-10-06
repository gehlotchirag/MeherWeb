'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Refrigeratordescription = mongoose.model('Refrigeratordescription'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, refrigeratordescription;

/**
 * Refrigeratordescription routes tests
 */
describe('Refrigeratordescription CRUD tests', function() {
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

		// Save a user to the test db and create new Refrigeratordescription
		user.save(function() {
			refrigeratordescription = {
				name: 'Refrigeratordescription Name'
			};

			done();
		});
	});

	it('should be able to save Refrigeratordescription instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Refrigeratordescription
				agent.post('/refrigeratordescriptions')
					.send(refrigeratordescription)
					.expect(200)
					.end(function(refrigeratordescriptionSaveErr, refrigeratordescriptionSaveRes) {
						// Handle Refrigeratordescription save error
						if (refrigeratordescriptionSaveErr) done(refrigeratordescriptionSaveErr);

						// Get a list of Refrigeratordescriptions
						agent.get('/refrigeratordescriptions')
							.end(function(refrigeratordescriptionsGetErr, refrigeratordescriptionsGetRes) {
								// Handle Refrigeratordescription save error
								if (refrigeratordescriptionsGetErr) done(refrigeratordescriptionsGetErr);

								// Get Refrigeratordescriptions list
								var refrigeratordescriptions = refrigeratordescriptionsGetRes.body;

								// Set assertions
								(refrigeratordescriptions[0].user._id).should.equal(userId);
								(refrigeratordescriptions[0].name).should.match('Refrigeratordescription Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Refrigeratordescription instance if not logged in', function(done) {
		agent.post('/refrigeratordescriptions')
			.send(refrigeratordescription)
			.expect(401)
			.end(function(refrigeratordescriptionSaveErr, refrigeratordescriptionSaveRes) {
				// Call the assertion callback
				done(refrigeratordescriptionSaveErr);
			});
	});

	it('should not be able to save Refrigeratordescription instance if no name is provided', function(done) {
		// Invalidate name field
		refrigeratordescription.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Refrigeratordescription
				agent.post('/refrigeratordescriptions')
					.send(refrigeratordescription)
					.expect(400)
					.end(function(refrigeratordescriptionSaveErr, refrigeratordescriptionSaveRes) {
						// Set message assertion
						(refrigeratordescriptionSaveRes.body.message).should.match('Please fill Refrigeratordescription name');
						
						// Handle Refrigeratordescription save error
						done(refrigeratordescriptionSaveErr);
					});
			});
	});

	it('should be able to update Refrigeratordescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Refrigeratordescription
				agent.post('/refrigeratordescriptions')
					.send(refrigeratordescription)
					.expect(200)
					.end(function(refrigeratordescriptionSaveErr, refrigeratordescriptionSaveRes) {
						// Handle Refrigeratordescription save error
						if (refrigeratordescriptionSaveErr) done(refrigeratordescriptionSaveErr);

						// Update Refrigeratordescription name
						refrigeratordescription.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Refrigeratordescription
						agent.put('/refrigeratordescriptions/' + refrigeratordescriptionSaveRes.body._id)
							.send(refrigeratordescription)
							.expect(200)
							.end(function(refrigeratordescriptionUpdateErr, refrigeratordescriptionUpdateRes) {
								// Handle Refrigeratordescription update error
								if (refrigeratordescriptionUpdateErr) done(refrigeratordescriptionUpdateErr);

								// Set assertions
								(refrigeratordescriptionUpdateRes.body._id).should.equal(refrigeratordescriptionSaveRes.body._id);
								(refrigeratordescriptionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Refrigeratordescriptions if not signed in', function(done) {
		// Create new Refrigeratordescription model instance
		var refrigeratordescriptionObj = new Refrigeratordescription(refrigeratordescription);

		// Save the Refrigeratordescription
		refrigeratordescriptionObj.save(function() {
			// Request Refrigeratordescriptions
			request(app).get('/refrigeratordescriptions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Refrigeratordescription if not signed in', function(done) {
		// Create new Refrigeratordescription model instance
		var refrigeratordescriptionObj = new Refrigeratordescription(refrigeratordescription);

		// Save the Refrigeratordescription
		refrigeratordescriptionObj.save(function() {
			request(app).get('/refrigeratordescriptions/' + refrigeratordescriptionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', refrigeratordescription.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Refrigeratordescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Refrigeratordescription
				agent.post('/refrigeratordescriptions')
					.send(refrigeratordescription)
					.expect(200)
					.end(function(refrigeratordescriptionSaveErr, refrigeratordescriptionSaveRes) {
						// Handle Refrigeratordescription save error
						if (refrigeratordescriptionSaveErr) done(refrigeratordescriptionSaveErr);

						// Delete existing Refrigeratordescription
						agent.delete('/refrigeratordescriptions/' + refrigeratordescriptionSaveRes.body._id)
							.send(refrigeratordescription)
							.expect(200)
							.end(function(refrigeratordescriptionDeleteErr, refrigeratordescriptionDeleteRes) {
								// Handle Refrigeratordescription error error
								if (refrigeratordescriptionDeleteErr) done(refrigeratordescriptionDeleteErr);

								// Set assertions
								(refrigeratordescriptionDeleteRes.body._id).should.equal(refrigeratordescriptionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Refrigeratordescription instance if not signed in', function(done) {
		// Set Refrigeratordescription user 
		refrigeratordescription.user = user;

		// Create new Refrigeratordescription model instance
		var refrigeratordescriptionObj = new Refrigeratordescription(refrigeratordescription);

		// Save the Refrigeratordescription
		refrigeratordescriptionObj.save(function() {
			// Try deleting Refrigeratordescription
			request(app).delete('/refrigeratordescriptions/' + refrigeratordescriptionObj._id)
			.expect(401)
			.end(function(refrigeratordescriptionDeleteErr, refrigeratordescriptionDeleteRes) {
				// Set message assertion
				(refrigeratordescriptionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Refrigeratordescription error error
				done(refrigeratordescriptionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Refrigeratordescription.remove().exec();
		done();
	});
});