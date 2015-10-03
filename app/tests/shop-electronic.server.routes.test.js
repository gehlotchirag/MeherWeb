'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ShopElectronic = mongoose.model('ShopElectronic'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, shopElectronic;

/**
 * Shop electronic routes tests
 */
describe('Shop electronic CRUD tests', function() {
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

		// Save a user to the test db and create new Shop electronic
		user.save(function() {
			shopElectronic = {
				name: 'Shop electronic Name'
			};

			done();
		});
	});

	it('should be able to save Shop electronic instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop electronic
				agent.post('/shop-electronics')
					.send(shopElectronic)
					.expect(200)
					.end(function(shopElectronicSaveErr, shopElectronicSaveRes) {
						// Handle Shop electronic save error
						if (shopElectronicSaveErr) done(shopElectronicSaveErr);

						// Get a list of Shop electronics
						agent.get('/shop-electronics')
							.end(function(shopElectronicsGetErr, shopElectronicsGetRes) {
								// Handle Shop electronic save error
								if (shopElectronicsGetErr) done(shopElectronicsGetErr);

								// Get Shop electronics list
								var shopElectronics = shopElectronicsGetRes.body;

								// Set assertions
								(shopElectronics[0].user._id).should.equal(userId);
								(shopElectronics[0].name).should.match('Shop electronic Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Shop electronic instance if not logged in', function(done) {
		agent.post('/shop-electronics')
			.send(shopElectronic)
			.expect(401)
			.end(function(shopElectronicSaveErr, shopElectronicSaveRes) {
				// Call the assertion callback
				done(shopElectronicSaveErr);
			});
	});

	it('should not be able to save Shop electronic instance if no name is provided', function(done) {
		// Invalidate name field
		shopElectronic.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop electronic
				agent.post('/shop-electronics')
					.send(shopElectronic)
					.expect(400)
					.end(function(shopElectronicSaveErr, shopElectronicSaveRes) {
						// Set message assertion
						(shopElectronicSaveRes.body.message).should.match('Please fill Shop electronic name');
						
						// Handle Shop electronic save error
						done(shopElectronicSaveErr);
					});
			});
	});

	it('should be able to update Shop electronic instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop electronic
				agent.post('/shop-electronics')
					.send(shopElectronic)
					.expect(200)
					.end(function(shopElectronicSaveErr, shopElectronicSaveRes) {
						// Handle Shop electronic save error
						if (shopElectronicSaveErr) done(shopElectronicSaveErr);

						// Update Shop electronic name
						shopElectronic.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Shop electronic
						agent.put('/shop-electronics/' + shopElectronicSaveRes.body._id)
							.send(shopElectronic)
							.expect(200)
							.end(function(shopElectronicUpdateErr, shopElectronicUpdateRes) {
								// Handle Shop electronic update error
								if (shopElectronicUpdateErr) done(shopElectronicUpdateErr);

								// Set assertions
								(shopElectronicUpdateRes.body._id).should.equal(shopElectronicSaveRes.body._id);
								(shopElectronicUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Shop electronics if not signed in', function(done) {
		// Create new Shop electronic model instance
		var shopElectronicObj = new ShopElectronic(shopElectronic);

		// Save the Shop electronic
		shopElectronicObj.save(function() {
			// Request Shop electronics
			request(app).get('/shop-electronics')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Shop electronic if not signed in', function(done) {
		// Create new Shop electronic model instance
		var shopElectronicObj = new ShopElectronic(shopElectronic);

		// Save the Shop electronic
		shopElectronicObj.save(function() {
			request(app).get('/shop-electronics/' + shopElectronicObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', shopElectronic.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Shop electronic instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop electronic
				agent.post('/shop-electronics')
					.send(shopElectronic)
					.expect(200)
					.end(function(shopElectronicSaveErr, shopElectronicSaveRes) {
						// Handle Shop electronic save error
						if (shopElectronicSaveErr) done(shopElectronicSaveErr);

						// Delete existing Shop electronic
						agent.delete('/shop-electronics/' + shopElectronicSaveRes.body._id)
							.send(shopElectronic)
							.expect(200)
							.end(function(shopElectronicDeleteErr, shopElectronicDeleteRes) {
								// Handle Shop electronic error error
								if (shopElectronicDeleteErr) done(shopElectronicDeleteErr);

								// Set assertions
								(shopElectronicDeleteRes.body._id).should.equal(shopElectronicSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Shop electronic instance if not signed in', function(done) {
		// Set Shop electronic user 
		shopElectronic.user = user;

		// Create new Shop electronic model instance
		var shopElectronicObj = new ShopElectronic(shopElectronic);

		// Save the Shop electronic
		shopElectronicObj.save(function() {
			// Try deleting Shop electronic
			request(app).delete('/shop-electronics/' + shopElectronicObj._id)
			.expect(401)
			.end(function(shopElectronicDeleteErr, shopElectronicDeleteRes) {
				// Set message assertion
				(shopElectronicDeleteRes.body.message).should.match('User is not logged in');

				// Handle Shop electronic error error
				done(shopElectronicDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ShopElectronic.remove().exec();
		done();
	});
});