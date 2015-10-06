'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mobiledescription = mongoose.model('Mobiledescription'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, mobiledescription;

/**
 * Mobiledescription routes tests
 */
describe('Mobiledescription CRUD tests', function() {
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

		// Save a user to the test db and create new Mobiledescription
		user.save(function() {
			mobiledescription = {
				name: 'Mobiledescription Name'
			};

			done();
		});
	});

	it('should be able to save Mobiledescription instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mobiledescription
				agent.post('/mobiledescriptions')
					.send(mobiledescription)
					.expect(200)
					.end(function(mobiledescriptionSaveErr, mobiledescriptionSaveRes) {
						// Handle Mobiledescription save error
						if (mobiledescriptionSaveErr) done(mobiledescriptionSaveErr);

						// Get a list of Mobiledescriptions
						agent.get('/mobiledescriptions')
							.end(function(mobiledescriptionsGetErr, mobiledescriptionsGetRes) {
								// Handle Mobiledescription save error
								if (mobiledescriptionsGetErr) done(mobiledescriptionsGetErr);

								// Get Mobiledescriptions list
								var mobiledescriptions = mobiledescriptionsGetRes.body;

								// Set assertions
								(mobiledescriptions[0].user._id).should.equal(userId);
								(mobiledescriptions[0].name).should.match('Mobiledescription Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Mobiledescription instance if not logged in', function(done) {
		agent.post('/mobiledescriptions')
			.send(mobiledescription)
			.expect(401)
			.end(function(mobiledescriptionSaveErr, mobiledescriptionSaveRes) {
				// Call the assertion callback
				done(mobiledescriptionSaveErr);
			});
	});

	it('should not be able to save Mobiledescription instance if no name is provided', function(done) {
		// Invalidate name field
		mobiledescription.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mobiledescription
				agent.post('/mobiledescriptions')
					.send(mobiledescription)
					.expect(400)
					.end(function(mobiledescriptionSaveErr, mobiledescriptionSaveRes) {
						// Set message assertion
						(mobiledescriptionSaveRes.body.message).should.match('Please fill Mobiledescription name');
						
						// Handle Mobiledescription save error
						done(mobiledescriptionSaveErr);
					});
			});
	});

	it('should be able to update Mobiledescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mobiledescription
				agent.post('/mobiledescriptions')
					.send(mobiledescription)
					.expect(200)
					.end(function(mobiledescriptionSaveErr, mobiledescriptionSaveRes) {
						// Handle Mobiledescription save error
						if (mobiledescriptionSaveErr) done(mobiledescriptionSaveErr);

						// Update Mobiledescription name
						mobiledescription.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Mobiledescription
						agent.put('/mobiledescriptions/' + mobiledescriptionSaveRes.body._id)
							.send(mobiledescription)
							.expect(200)
							.end(function(mobiledescriptionUpdateErr, mobiledescriptionUpdateRes) {
								// Handle Mobiledescription update error
								if (mobiledescriptionUpdateErr) done(mobiledescriptionUpdateErr);

								// Set assertions
								(mobiledescriptionUpdateRes.body._id).should.equal(mobiledescriptionSaveRes.body._id);
								(mobiledescriptionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Mobiledescriptions if not signed in', function(done) {
		// Create new Mobiledescription model instance
		var mobiledescriptionObj = new Mobiledescription(mobiledescription);

		// Save the Mobiledescription
		mobiledescriptionObj.save(function() {
			// Request Mobiledescriptions
			request(app).get('/mobiledescriptions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Mobiledescription if not signed in', function(done) {
		// Create new Mobiledescription model instance
		var mobiledescriptionObj = new Mobiledescription(mobiledescription);

		// Save the Mobiledescription
		mobiledescriptionObj.save(function() {
			request(app).get('/mobiledescriptions/' + mobiledescriptionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', mobiledescription.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Mobiledescription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mobiledescription
				agent.post('/mobiledescriptions')
					.send(mobiledescription)
					.expect(200)
					.end(function(mobiledescriptionSaveErr, mobiledescriptionSaveRes) {
						// Handle Mobiledescription save error
						if (mobiledescriptionSaveErr) done(mobiledescriptionSaveErr);

						// Delete existing Mobiledescription
						agent.delete('/mobiledescriptions/' + mobiledescriptionSaveRes.body._id)
							.send(mobiledescription)
							.expect(200)
							.end(function(mobiledescriptionDeleteErr, mobiledescriptionDeleteRes) {
								// Handle Mobiledescription error error
								if (mobiledescriptionDeleteErr) done(mobiledescriptionDeleteErr);

								// Set assertions
								(mobiledescriptionDeleteRes.body._id).should.equal(mobiledescriptionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Mobiledescription instance if not signed in', function(done) {
		// Set Mobiledescription user 
		mobiledescription.user = user;

		// Create new Mobiledescription model instance
		var mobiledescriptionObj = new Mobiledescription(mobiledescription);

		// Save the Mobiledescription
		mobiledescriptionObj.save(function() {
			// Try deleting Mobiledescription
			request(app).delete('/mobiledescriptions/' + mobiledescriptionObj._id)
			.expect(401)
			.end(function(mobiledescriptionDeleteErr, mobiledescriptionDeleteRes) {
				// Set message assertion
				(mobiledescriptionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Mobiledescription error error
				done(mobiledescriptionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Mobiledescription.remove().exec();
		done();
	});
});