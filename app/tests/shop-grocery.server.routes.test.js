'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ShopGrocery = mongoose.model('ShopGrocery'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, shopGrocery;

/**
 * Shop grocery routes tests
 */
describe('Shop grocery CRUD tests', function() {
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

		// Save a user to the test db and create new Shop grocery
		user.save(function() {
			shopGrocery = {
				name: 'Shop grocery Name'
			};

			done();
		});
	});

	it('should be able to save Shop grocery instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop grocery
				agent.post('/shop-groceries')
					.send(shopGrocery)
					.expect(200)
					.end(function(shopGrocerySaveErr, shopGrocerySaveRes) {
						// Handle Shop grocery save error
						if (shopGrocerySaveErr) done(shopGrocerySaveErr);

						// Get a list of Shop groceries
						agent.get('/shop-groceries')
							.end(function(shopGroceriesGetErr, shopGroceriesGetRes) {
								// Handle Shop grocery save error
								if (shopGroceriesGetErr) done(shopGroceriesGetErr);

								// Get Shop groceries list
								var shopGroceries = shopGroceriesGetRes.body;

								// Set assertions
								(shopGroceries[0].user._id).should.equal(userId);
								(shopGroceries[0].name).should.match('Shop grocery Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Shop grocery instance if not logged in', function(done) {
		agent.post('/shop-groceries')
			.send(shopGrocery)
			.expect(401)
			.end(function(shopGrocerySaveErr, shopGrocerySaveRes) {
				// Call the assertion callback
				done(shopGrocerySaveErr);
			});
	});

	it('should not be able to save Shop grocery instance if no name is provided', function(done) {
		// Invalidate name field
		shopGrocery.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop grocery
				agent.post('/shop-groceries')
					.send(shopGrocery)
					.expect(400)
					.end(function(shopGrocerySaveErr, shopGrocerySaveRes) {
						// Set message assertion
						(shopGrocerySaveRes.body.message).should.match('Please fill Shop grocery name');
						
						// Handle Shop grocery save error
						done(shopGrocerySaveErr);
					});
			});
	});

	it('should be able to update Shop grocery instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop grocery
				agent.post('/shop-groceries')
					.send(shopGrocery)
					.expect(200)
					.end(function(shopGrocerySaveErr, shopGrocerySaveRes) {
						// Handle Shop grocery save error
						if (shopGrocerySaveErr) done(shopGrocerySaveErr);

						// Update Shop grocery name
						shopGrocery.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Shop grocery
						agent.put('/shop-groceries/' + shopGrocerySaveRes.body._id)
							.send(shopGrocery)
							.expect(200)
							.end(function(shopGroceryUpdateErr, shopGroceryUpdateRes) {
								// Handle Shop grocery update error
								if (shopGroceryUpdateErr) done(shopGroceryUpdateErr);

								// Set assertions
								(shopGroceryUpdateRes.body._id).should.equal(shopGrocerySaveRes.body._id);
								(shopGroceryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Shop groceries if not signed in', function(done) {
		// Create new Shop grocery model instance
		var shopGroceryObj = new ShopGrocery(shopGrocery);

		// Save the Shop grocery
		shopGroceryObj.save(function() {
			// Request Shop groceries
			request(app).get('/shop-groceries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Shop grocery if not signed in', function(done) {
		// Create new Shop grocery model instance
		var shopGroceryObj = new ShopGrocery(shopGrocery);

		// Save the Shop grocery
		shopGroceryObj.save(function() {
			request(app).get('/shop-groceries/' + shopGroceryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', shopGrocery.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Shop grocery instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop grocery
				agent.post('/shop-groceries')
					.send(shopGrocery)
					.expect(200)
					.end(function(shopGrocerySaveErr, shopGrocerySaveRes) {
						// Handle Shop grocery save error
						if (shopGrocerySaveErr) done(shopGrocerySaveErr);

						// Delete existing Shop grocery
						agent.delete('/shop-groceries/' + shopGrocerySaveRes.body._id)
							.send(shopGrocery)
							.expect(200)
							.end(function(shopGroceryDeleteErr, shopGroceryDeleteRes) {
								// Handle Shop grocery error error
								if (shopGroceryDeleteErr) done(shopGroceryDeleteErr);

								// Set assertions
								(shopGroceryDeleteRes.body._id).should.equal(shopGrocerySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Shop grocery instance if not signed in', function(done) {
		// Set Shop grocery user 
		shopGrocery.user = user;

		// Create new Shop grocery model instance
		var shopGroceryObj = new ShopGrocery(shopGrocery);

		// Save the Shop grocery
		shopGroceryObj.save(function() {
			// Try deleting Shop grocery
			request(app).delete('/shop-groceries/' + shopGroceryObj._id)
			.expect(401)
			.end(function(shopGroceryDeleteErr, shopGroceryDeleteRes) {
				// Set message assertion
				(shopGroceryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Shop grocery error error
				done(shopGroceryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ShopGrocery.remove().exec();
		done();
	});
});