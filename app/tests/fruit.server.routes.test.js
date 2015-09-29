'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fruit = mongoose.model('Fruit'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, fruit;

/**
 * Fruit routes tests
 */
describe('Fruit CRUD tests', function() {
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

		// Save a user to the test db and create new Fruit
		user.save(function() {
			fruit = {
				name: 'Fruit Name'
			};

			done();
		});
	});

	it('should be able to save Fruit instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fruit
				agent.post('/fruits')
					.send(fruit)
					.expect(200)
					.end(function(fruitSaveErr, fruitSaveRes) {
						// Handle Fruit save error
						if (fruitSaveErr) done(fruitSaveErr);

						// Get a list of Fruits
						agent.get('/fruits')
							.end(function(fruitsGetErr, fruitsGetRes) {
								// Handle Fruit save error
								if (fruitsGetErr) done(fruitsGetErr);

								// Get Fruits list
								var fruits = fruitsGetRes.body;

								// Set assertions
								(fruits[0].user._id).should.equal(userId);
								(fruits[0].name).should.match('Fruit Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Fruit instance if not logged in', function(done) {
		agent.post('/fruits')
			.send(fruit)
			.expect(401)
			.end(function(fruitSaveErr, fruitSaveRes) {
				// Call the assertion callback
				done(fruitSaveErr);
			});
	});

	it('should not be able to save Fruit instance if no name is provided', function(done) {
		// Invalidate name field
		fruit.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fruit
				agent.post('/fruits')
					.send(fruit)
					.expect(400)
					.end(function(fruitSaveErr, fruitSaveRes) {
						// Set message assertion
						(fruitSaveRes.body.message).should.match('Please fill Fruit name');
						
						// Handle Fruit save error
						done(fruitSaveErr);
					});
			});
	});

	it('should be able to update Fruit instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fruit
				agent.post('/fruits')
					.send(fruit)
					.expect(200)
					.end(function(fruitSaveErr, fruitSaveRes) {
						// Handle Fruit save error
						if (fruitSaveErr) done(fruitSaveErr);

						// Update Fruit name
						fruit.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Fruit
						agent.put('/fruits/' + fruitSaveRes.body._id)
							.send(fruit)
							.expect(200)
							.end(function(fruitUpdateErr, fruitUpdateRes) {
								// Handle Fruit update error
								if (fruitUpdateErr) done(fruitUpdateErr);

								// Set assertions
								(fruitUpdateRes.body._id).should.equal(fruitSaveRes.body._id);
								(fruitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Fruits if not signed in', function(done) {
		// Create new Fruit model instance
		var fruitObj = new Fruit(fruit);

		// Save the Fruit
		fruitObj.save(function() {
			// Request Fruits
			request(app).get('/fruits')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Fruit if not signed in', function(done) {
		// Create new Fruit model instance
		var fruitObj = new Fruit(fruit);

		// Save the Fruit
		fruitObj.save(function() {
			request(app).get('/fruits/' + fruitObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', fruit.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Fruit instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fruit
				agent.post('/fruits')
					.send(fruit)
					.expect(200)
					.end(function(fruitSaveErr, fruitSaveRes) {
						// Handle Fruit save error
						if (fruitSaveErr) done(fruitSaveErr);

						// Delete existing Fruit
						agent.delete('/fruits/' + fruitSaveRes.body._id)
							.send(fruit)
							.expect(200)
							.end(function(fruitDeleteErr, fruitDeleteRes) {
								// Handle Fruit error error
								if (fruitDeleteErr) done(fruitDeleteErr);

								// Set assertions
								(fruitDeleteRes.body._id).should.equal(fruitSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Fruit instance if not signed in', function(done) {
		// Set Fruit user 
		fruit.user = user;

		// Create new Fruit model instance
		var fruitObj = new Fruit(fruit);

		// Save the Fruit
		fruitObj.save(function() {
			// Try deleting Fruit
			request(app).delete('/fruits/' + fruitObj._id)
			.expect(401)
			.end(function(fruitDeleteErr, fruitDeleteRes) {
				// Set message assertion
				(fruitDeleteRes.body.message).should.match('User is not logged in');

				// Handle Fruit error error
				done(fruitDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Fruit.remove().exec();
		done();
	});
});