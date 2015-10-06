'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Refrigerator = mongoose.model('Refrigerator'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, refrigerator;

/**
 * Refrigerator routes tests
 */
describe('Refrigerator CRUD tests', function() {
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

		// Save a user to the test db and create new Refrigerator
		user.save(function() {
			refrigerator = {
				name: 'Refrigerator Name'
			};

			done();
		});
	});

	it('should be able to save Refrigerator instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Refrigerator
				agent.post('/refrigerators')
					.send(refrigerator)
					.expect(200)
					.end(function(refrigeratorSaveErr, refrigeratorSaveRes) {
						// Handle Refrigerator save error
						if (refrigeratorSaveErr) done(refrigeratorSaveErr);

						// Get a list of Refrigerators
						agent.get('/refrigerators')
							.end(function(refrigeratorsGetErr, refrigeratorsGetRes) {
								// Handle Refrigerator save error
								if (refrigeratorsGetErr) done(refrigeratorsGetErr);

								// Get Refrigerators list
								var refrigerators = refrigeratorsGetRes.body;

								// Set assertions
								(refrigerators[0].user._id).should.equal(userId);
								(refrigerators[0].name).should.match('Refrigerator Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Refrigerator instance if not logged in', function(done) {
		agent.post('/refrigerators')
			.send(refrigerator)
			.expect(401)
			.end(function(refrigeratorSaveErr, refrigeratorSaveRes) {
				// Call the assertion callback
				done(refrigeratorSaveErr);
			});
	});

	it('should not be able to save Refrigerator instance if no name is provided', function(done) {
		// Invalidate name field
		refrigerator.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Refrigerator
				agent.post('/refrigerators')
					.send(refrigerator)
					.expect(400)
					.end(function(refrigeratorSaveErr, refrigeratorSaveRes) {
						// Set message assertion
						(refrigeratorSaveRes.body.message).should.match('Please fill Refrigerator name');
						
						// Handle Refrigerator save error
						done(refrigeratorSaveErr);
					});
			});
	});

	it('should be able to update Refrigerator instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Refrigerator
				agent.post('/refrigerators')
					.send(refrigerator)
					.expect(200)
					.end(function(refrigeratorSaveErr, refrigeratorSaveRes) {
						// Handle Refrigerator save error
						if (refrigeratorSaveErr) done(refrigeratorSaveErr);

						// Update Refrigerator name
						refrigerator.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Refrigerator
						agent.put('/refrigerators/' + refrigeratorSaveRes.body._id)
							.send(refrigerator)
							.expect(200)
							.end(function(refrigeratorUpdateErr, refrigeratorUpdateRes) {
								// Handle Refrigerator update error
								if (refrigeratorUpdateErr) done(refrigeratorUpdateErr);

								// Set assertions
								(refrigeratorUpdateRes.body._id).should.equal(refrigeratorSaveRes.body._id);
								(refrigeratorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Refrigerators if not signed in', function(done) {
		// Create new Refrigerator model instance
		var refrigeratorObj = new Refrigerator(refrigerator);

		// Save the Refrigerator
		refrigeratorObj.save(function() {
			// Request Refrigerators
			request(app).get('/refrigerators')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Refrigerator if not signed in', function(done) {
		// Create new Refrigerator model instance
		var refrigeratorObj = new Refrigerator(refrigerator);

		// Save the Refrigerator
		refrigeratorObj.save(function() {
			request(app).get('/refrigerators/' + refrigeratorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', refrigerator.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Refrigerator instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Refrigerator
				agent.post('/refrigerators')
					.send(refrigerator)
					.expect(200)
					.end(function(refrigeratorSaveErr, refrigeratorSaveRes) {
						// Handle Refrigerator save error
						if (refrigeratorSaveErr) done(refrigeratorSaveErr);

						// Delete existing Refrigerator
						agent.delete('/refrigerators/' + refrigeratorSaveRes.body._id)
							.send(refrigerator)
							.expect(200)
							.end(function(refrigeratorDeleteErr, refrigeratorDeleteRes) {
								// Handle Refrigerator error error
								if (refrigeratorDeleteErr) done(refrigeratorDeleteErr);

								// Set assertions
								(refrigeratorDeleteRes.body._id).should.equal(refrigeratorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Refrigerator instance if not signed in', function(done) {
		// Set Refrigerator user 
		refrigerator.user = user;

		// Create new Refrigerator model instance
		var refrigeratorObj = new Refrigerator(refrigerator);

		// Save the Refrigerator
		refrigeratorObj.save(function() {
			// Try deleting Refrigerator
			request(app).delete('/refrigerators/' + refrigeratorObj._id)
			.expect(401)
			.end(function(refrigeratorDeleteErr, refrigeratorDeleteRes) {
				// Set message assertion
				(refrigeratorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Refrigerator error error
				done(refrigeratorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Refrigerator.remove().exec();
		done();
	});
});