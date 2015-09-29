'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SproutsVegetable = mongoose.model('SproutsVegetable'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sproutsVegetable;

/**
 * Sprouts vegetable routes tests
 */
describe('Sprouts vegetable CRUD tests', function() {
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

		// Save a user to the test db and create new Sprouts vegetable
		user.save(function() {
			sproutsVegetable = {
				name: 'Sprouts vegetable Name'
			};

			done();
		});
	});

	it('should be able to save Sprouts vegetable instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sprouts vegetable
				agent.post('/sprouts-vegetables')
					.send(sproutsVegetable)
					.expect(200)
					.end(function(sproutsVegetableSaveErr, sproutsVegetableSaveRes) {
						// Handle Sprouts vegetable save error
						if (sproutsVegetableSaveErr) done(sproutsVegetableSaveErr);

						// Get a list of Sprouts vegetables
						agent.get('/sprouts-vegetables')
							.end(function(sproutsVegetablesGetErr, sproutsVegetablesGetRes) {
								// Handle Sprouts vegetable save error
								if (sproutsVegetablesGetErr) done(sproutsVegetablesGetErr);

								// Get Sprouts vegetables list
								var sproutsVegetables = sproutsVegetablesGetRes.body;

								// Set assertions
								(sproutsVegetables[0].user._id).should.equal(userId);
								(sproutsVegetables[0].name).should.match('Sprouts vegetable Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sprouts vegetable instance if not logged in', function(done) {
		agent.post('/sprouts-vegetables')
			.send(sproutsVegetable)
			.expect(401)
			.end(function(sproutsVegetableSaveErr, sproutsVegetableSaveRes) {
				// Call the assertion callback
				done(sproutsVegetableSaveErr);
			});
	});

	it('should not be able to save Sprouts vegetable instance if no name is provided', function(done) {
		// Invalidate name field
		sproutsVegetable.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sprouts vegetable
				agent.post('/sprouts-vegetables')
					.send(sproutsVegetable)
					.expect(400)
					.end(function(sproutsVegetableSaveErr, sproutsVegetableSaveRes) {
						// Set message assertion
						(sproutsVegetableSaveRes.body.message).should.match('Please fill Sprouts vegetable name');
						
						// Handle Sprouts vegetable save error
						done(sproutsVegetableSaveErr);
					});
			});
	});

	it('should be able to update Sprouts vegetable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sprouts vegetable
				agent.post('/sprouts-vegetables')
					.send(sproutsVegetable)
					.expect(200)
					.end(function(sproutsVegetableSaveErr, sproutsVegetableSaveRes) {
						// Handle Sprouts vegetable save error
						if (sproutsVegetableSaveErr) done(sproutsVegetableSaveErr);

						// Update Sprouts vegetable name
						sproutsVegetable.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sprouts vegetable
						agent.put('/sprouts-vegetables/' + sproutsVegetableSaveRes.body._id)
							.send(sproutsVegetable)
							.expect(200)
							.end(function(sproutsVegetableUpdateErr, sproutsVegetableUpdateRes) {
								// Handle Sprouts vegetable update error
								if (sproutsVegetableUpdateErr) done(sproutsVegetableUpdateErr);

								// Set assertions
								(sproutsVegetableUpdateRes.body._id).should.equal(sproutsVegetableSaveRes.body._id);
								(sproutsVegetableUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sprouts vegetables if not signed in', function(done) {
		// Create new Sprouts vegetable model instance
		var sproutsVegetableObj = new SproutsVegetable(sproutsVegetable);

		// Save the Sprouts vegetable
		sproutsVegetableObj.save(function() {
			// Request Sprouts vegetables
			request(app).get('/sprouts-vegetables')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sprouts vegetable if not signed in', function(done) {
		// Create new Sprouts vegetable model instance
		var sproutsVegetableObj = new SproutsVegetable(sproutsVegetable);

		// Save the Sprouts vegetable
		sproutsVegetableObj.save(function() {
			request(app).get('/sprouts-vegetables/' + sproutsVegetableObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sproutsVegetable.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sprouts vegetable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sprouts vegetable
				agent.post('/sprouts-vegetables')
					.send(sproutsVegetable)
					.expect(200)
					.end(function(sproutsVegetableSaveErr, sproutsVegetableSaveRes) {
						// Handle Sprouts vegetable save error
						if (sproutsVegetableSaveErr) done(sproutsVegetableSaveErr);

						// Delete existing Sprouts vegetable
						agent.delete('/sprouts-vegetables/' + sproutsVegetableSaveRes.body._id)
							.send(sproutsVegetable)
							.expect(200)
							.end(function(sproutsVegetableDeleteErr, sproutsVegetableDeleteRes) {
								// Handle Sprouts vegetable error error
								if (sproutsVegetableDeleteErr) done(sproutsVegetableDeleteErr);

								// Set assertions
								(sproutsVegetableDeleteRes.body._id).should.equal(sproutsVegetableSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sprouts vegetable instance if not signed in', function(done) {
		// Set Sprouts vegetable user 
		sproutsVegetable.user = user;

		// Create new Sprouts vegetable model instance
		var sproutsVegetableObj = new SproutsVegetable(sproutsVegetable);

		// Save the Sprouts vegetable
		sproutsVegetableObj.save(function() {
			// Try deleting Sprouts vegetable
			request(app).delete('/sprouts-vegetables/' + sproutsVegetableObj._id)
			.expect(401)
			.end(function(sproutsVegetableDeleteErr, sproutsVegetableDeleteRes) {
				// Set message assertion
				(sproutsVegetableDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sprouts vegetable error error
				done(sproutsVegetableDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		SproutsVegetable.remove().exec();
		done();
	});
});