'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Vegetable = mongoose.model('Vegetable'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, vegetable;

/**
 * Vegetable routes tests
 */
describe('Vegetable CRUD tests', function() {
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

		// Save a user to the test db and create new Vegetable
		user.save(function() {
			vegetable = {
				name: 'Vegetable Name'
			};

			done();
		});
	});

	it('should be able to save Vegetable instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vegetable
				agent.post('/vegetables')
					.send(vegetable)
					.expect(200)
					.end(function(vegetableSaveErr, vegetableSaveRes) {
						// Handle Vegetable save error
						if (vegetableSaveErr) done(vegetableSaveErr);

						// Get a list of Vegetables
						agent.get('/vegetables')
							.end(function(vegetablesGetErr, vegetablesGetRes) {
								// Handle Vegetable save error
								if (vegetablesGetErr) done(vegetablesGetErr);

								// Get Vegetables list
								var vegetables = vegetablesGetRes.body;

								// Set assertions
								(vegetables[0].user._id).should.equal(userId);
								(vegetables[0].name).should.match('Vegetable Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vegetable instance if not logged in', function(done) {
		agent.post('/vegetables')
			.send(vegetable)
			.expect(401)
			.end(function(vegetableSaveErr, vegetableSaveRes) {
				// Call the assertion callback
				done(vegetableSaveErr);
			});
	});

	it('should not be able to save Vegetable instance if no name is provided', function(done) {
		// Invalidate name field
		vegetable.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vegetable
				agent.post('/vegetables')
					.send(vegetable)
					.expect(400)
					.end(function(vegetableSaveErr, vegetableSaveRes) {
						// Set message assertion
						(vegetableSaveRes.body.message).should.match('Please fill Vegetable name');
						
						// Handle Vegetable save error
						done(vegetableSaveErr);
					});
			});
	});

	it('should be able to update Vegetable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vegetable
				agent.post('/vegetables')
					.send(vegetable)
					.expect(200)
					.end(function(vegetableSaveErr, vegetableSaveRes) {
						// Handle Vegetable save error
						if (vegetableSaveErr) done(vegetableSaveErr);

						// Update Vegetable name
						vegetable.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vegetable
						agent.put('/vegetables/' + vegetableSaveRes.body._id)
							.send(vegetable)
							.expect(200)
							.end(function(vegetableUpdateErr, vegetableUpdateRes) {
								// Handle Vegetable update error
								if (vegetableUpdateErr) done(vegetableUpdateErr);

								// Set assertions
								(vegetableUpdateRes.body._id).should.equal(vegetableSaveRes.body._id);
								(vegetableUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vegetables if not signed in', function(done) {
		// Create new Vegetable model instance
		var vegetableObj = new Vegetable(vegetable);

		// Save the Vegetable
		vegetableObj.save(function() {
			// Request Vegetables
			request(app).get('/vegetables')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vegetable if not signed in', function(done) {
		// Create new Vegetable model instance
		var vegetableObj = new Vegetable(vegetable);

		// Save the Vegetable
		vegetableObj.save(function() {
			request(app).get('/vegetables/' + vegetableObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vegetable.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vegetable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vegetable
				agent.post('/vegetables')
					.send(vegetable)
					.expect(200)
					.end(function(vegetableSaveErr, vegetableSaveRes) {
						// Handle Vegetable save error
						if (vegetableSaveErr) done(vegetableSaveErr);

						// Delete existing Vegetable
						agent.delete('/vegetables/' + vegetableSaveRes.body._id)
							.send(vegetable)
							.expect(200)
							.end(function(vegetableDeleteErr, vegetableDeleteRes) {
								// Handle Vegetable error error
								if (vegetableDeleteErr) done(vegetableDeleteErr);

								// Set assertions
								(vegetableDeleteRes.body._id).should.equal(vegetableSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vegetable instance if not signed in', function(done) {
		// Set Vegetable user 
		vegetable.user = user;

		// Create new Vegetable model instance
		var vegetableObj = new Vegetable(vegetable);

		// Save the Vegetable
		vegetableObj.save(function() {
			// Try deleting Vegetable
			request(app).delete('/vegetables/' + vegetableObj._id)
			.expect(401)
			.end(function(vegetableDeleteErr, vegetableDeleteRes) {
				// Set message assertion
				(vegetableDeleteRes.body.message).should.match('User is not logged in');

				// Handle Vegetable error error
				done(vegetableDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Vegetable.remove().exec();
		done();
	});
});