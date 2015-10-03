'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ShopFruit = mongoose.model('ShopFruit'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, shopFruit;

/**
 * Shop fruit routes tests
 */
describe('Shop fruit CRUD tests', function() {
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

		// Save a user to the test db and create new Shop fruit
		user.save(function() {
			shopFruit = {
				name: 'Shop fruit Name'
			};

			done();
		});
	});

	it('should be able to save Shop fruit instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop fruit
				agent.post('/shop-fruits')
					.send(shopFruit)
					.expect(200)
					.end(function(shopFruitSaveErr, shopFruitSaveRes) {
						// Handle Shop fruit save error
						if (shopFruitSaveErr) done(shopFruitSaveErr);

						// Get a list of Shop fruits
						agent.get('/shop-fruits')
							.end(function(shopFruitsGetErr, shopFruitsGetRes) {
								// Handle Shop fruit save error
								if (shopFruitsGetErr) done(shopFruitsGetErr);

								// Get Shop fruits list
								var shopFruits = shopFruitsGetRes.body;

								// Set assertions
								(shopFruits[0].user._id).should.equal(userId);
								(shopFruits[0].name).should.match('Shop fruit Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Shop fruit instance if not logged in', function(done) {
		agent.post('/shop-fruits')
			.send(shopFruit)
			.expect(401)
			.end(function(shopFruitSaveErr, shopFruitSaveRes) {
				// Call the assertion callback
				done(shopFruitSaveErr);
			});
	});

	it('should not be able to save Shop fruit instance if no name is provided', function(done) {
		// Invalidate name field
		shopFruit.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop fruit
				agent.post('/shop-fruits')
					.send(shopFruit)
					.expect(400)
					.end(function(shopFruitSaveErr, shopFruitSaveRes) {
						// Set message assertion
						(shopFruitSaveRes.body.message).should.match('Please fill Shop fruit name');
						
						// Handle Shop fruit save error
						done(shopFruitSaveErr);
					});
			});
	});

	it('should be able to update Shop fruit instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop fruit
				agent.post('/shop-fruits')
					.send(shopFruit)
					.expect(200)
					.end(function(shopFruitSaveErr, shopFruitSaveRes) {
						// Handle Shop fruit save error
						if (shopFruitSaveErr) done(shopFruitSaveErr);

						// Update Shop fruit name
						shopFruit.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Shop fruit
						agent.put('/shop-fruits/' + shopFruitSaveRes.body._id)
							.send(shopFruit)
							.expect(200)
							.end(function(shopFruitUpdateErr, shopFruitUpdateRes) {
								// Handle Shop fruit update error
								if (shopFruitUpdateErr) done(shopFruitUpdateErr);

								// Set assertions
								(shopFruitUpdateRes.body._id).should.equal(shopFruitSaveRes.body._id);
								(shopFruitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Shop fruits if not signed in', function(done) {
		// Create new Shop fruit model instance
		var shopFruitObj = new ShopFruit(shopFruit);

		// Save the Shop fruit
		shopFruitObj.save(function() {
			// Request Shop fruits
			request(app).get('/shop-fruits')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Shop fruit if not signed in', function(done) {
		// Create new Shop fruit model instance
		var shopFruitObj = new ShopFruit(shopFruit);

		// Save the Shop fruit
		shopFruitObj.save(function() {
			request(app).get('/shop-fruits/' + shopFruitObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', shopFruit.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Shop fruit instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop fruit
				agent.post('/shop-fruits')
					.send(shopFruit)
					.expect(200)
					.end(function(shopFruitSaveErr, shopFruitSaveRes) {
						// Handle Shop fruit save error
						if (shopFruitSaveErr) done(shopFruitSaveErr);

						// Delete existing Shop fruit
						agent.delete('/shop-fruits/' + shopFruitSaveRes.body._id)
							.send(shopFruit)
							.expect(200)
							.end(function(shopFruitDeleteErr, shopFruitDeleteRes) {
								// Handle Shop fruit error error
								if (shopFruitDeleteErr) done(shopFruitDeleteErr);

								// Set assertions
								(shopFruitDeleteRes.body._id).should.equal(shopFruitSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Shop fruit instance if not signed in', function(done) {
		// Set Shop fruit user 
		shopFruit.user = user;

		// Create new Shop fruit model instance
		var shopFruitObj = new ShopFruit(shopFruit);

		// Save the Shop fruit
		shopFruitObj.save(function() {
			// Try deleting Shop fruit
			request(app).delete('/shop-fruits/' + shopFruitObj._id)
			.expect(401)
			.end(function(shopFruitDeleteErr, shopFruitDeleteRes) {
				// Set message assertion
				(shopFruitDeleteRes.body.message).should.match('User is not logged in');

				// Handle Shop fruit error error
				done(shopFruitDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ShopFruit.remove().exec();
		done();
	});
});