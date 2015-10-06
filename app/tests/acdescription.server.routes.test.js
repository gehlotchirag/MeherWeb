'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Acdescription = mongoose.model('Acdescription'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, acdescription;

/**
 * Acdescription routes tests
 */
describe('Acdescription CRUD tests', function() {
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

		// Save a user to the test db and create new Acdescription
		user.save(function() {
			acdescription = {
				name: 'Acdescription Name'
			};

			done();
		});
	});

	it('should be able to save Acdescription instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Acdescription
				agent.post('/acdescriptions')
					.send(acdescription)
					.expect(200)
					.end(function(acdescriptionSaveErr, acdescriptionSaveRes) {
						// Handle Acdescription save error
						if (acdescriptionSaveErr) done(acdescriptionSaveErr);

						// Get a list of Acdescriptions
						agent.get('/acdescriptions')
							.end(function(acdescriptionsGetErr, acdescriptionsGetRes) {
								// Handle Acdescription save error
								if (acdescriptionsGetErr) done(acdescriptionsGetErr);

								// Get Acdescriptions list
								var acdescriptions = acdescriptionsGetRes.body;

								// Set assertions
								(acdescriptions[0].user._id).should.equal(userId);
								(acdescriptions[0].name).should.match('Acdescription Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Acdescription instance if not logged in', function(done) {
		agent.post('/acdescriptions')
			.send(acdescription)
			.expect(401)
			.end(function(acdescriptionSaveErr, acdescriptionSaveRes) {
				// Call the assertion callback
				done(acdescriptionSaveErr);
			});
	});

	it('should not be able to save Acdescription instance if no name is provided', function(done) {
		// Invalidate name field
		acdescription.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Acdescription
				agent.post('/acdescriptions')
					.send(acdescription)
					.expect(400)
					.end(function(acdescriptionSaveErr, acdescriptionSaveRes) {
						// Set message assertion
						(acdescriptionSaveRes.body.message).should.match('Please fill Acdescription name');
						
						// Handle Acdescription save error
						done(acdescriptionSaveErr);
					});
			});
	});

	it('should be able to update Acdescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Acdescription
				agent.post('/acdescriptions')
					.send(acdescription)
					.expect(200)
					.end(function(acdescriptionSaveErr, acdescriptionSaveRes) {
						// Handle Acdescription save error
						if (acdescriptionSaveErr) done(acdescriptionSaveErr);

						// Update Acdescription name
						acdescription.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Acdescription
						agent.put('/acdescriptions/' + acdescriptionSaveRes.body._id)
							.send(acdescription)
							.expect(200)
							.end(function(acdescriptionUpdateErr, acdescriptionUpdateRes) {
								// Handle Acdescription update error
								if (acdescriptionUpdateErr) done(acdescriptionUpdateErr);

								// Set assertions
								(acdescriptionUpdateRes.body._id).should.equal(acdescriptionSaveRes.body._id);
								(acdescriptionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Acdescriptions if not signed in', function(done) {
		// Create new Acdescription model instance
		var acdescriptionObj = new Acdescription(acdescription);

		// Save the Acdescription
		acdescriptionObj.save(function() {
			// Request Acdescriptions
			request(app).get('/acdescriptions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Acdescription if not signed in', function(done) {
		// Create new Acdescription model instance
		var acdescriptionObj = new Acdescription(acdescription);

		// Save the Acdescription
		acdescriptionObj.save(function() {
			request(app).get('/acdescriptions/' + acdescriptionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', acdescription.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Acdescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Acdescription
				agent.post('/acdescriptions')
					.send(acdescription)
					.expect(200)
					.end(function(acdescriptionSaveErr, acdescriptionSaveRes) {
						// Handle Acdescription save error
						if (acdescriptionSaveErr) done(acdescriptionSaveErr);

						// Delete existing Acdescription
						agent.delete('/acdescriptions/' + acdescriptionSaveRes.body._id)
							.send(acdescription)
							.expect(200)
							.end(function(acdescriptionDeleteErr, acdescriptionDeleteRes) {
								// Handle Acdescription error error
								if (acdescriptionDeleteErr) done(acdescriptionDeleteErr);

								// Set assertions
								(acdescriptionDeleteRes.body._id).should.equal(acdescriptionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Acdescription instance if not signed in', function(done) {
		// Set Acdescription user 
		acdescription.user = user;

		// Create new Acdescription model instance
		var acdescriptionObj = new Acdescription(acdescription);

		// Save the Acdescription
		acdescriptionObj.save(function() {
			// Try deleting Acdescription
			request(app).delete('/acdescriptions/' + acdescriptionObj._id)
			.expect(401)
			.end(function(acdescriptionDeleteErr, acdescriptionDeleteRes) {
				// Set message assertion
				(acdescriptionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Acdescription error error
				done(acdescriptionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Acdescription.remove().exec();
		done();
	});
});