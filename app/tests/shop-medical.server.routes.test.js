'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ShopMedical = mongoose.model('ShopMedical'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, shopMedical;

/**
 * Shop medical routes tests
 */
describe('Shop medical CRUD tests', function() {
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

		// Save a user to the test db and create new Shop medical
		user.save(function() {
			shopMedical = {
				name: 'Shop medical Name'
			};

			done();
		});
	});

	it('should be able to save Shop medical instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop medical
				agent.post('/shop-medicals')
					.send(shopMedical)
					.expect(200)
					.end(function(shopMedicalSaveErr, shopMedicalSaveRes) {
						// Handle Shop medical save error
						if (shopMedicalSaveErr) done(shopMedicalSaveErr);

						// Get a list of Shop medicals
						agent.get('/shop-medicals')
							.end(function(shopMedicalsGetErr, shopMedicalsGetRes) {
								// Handle Shop medical save error
								if (shopMedicalsGetErr) done(shopMedicalsGetErr);

								// Get Shop medicals list
								var shopMedicals = shopMedicalsGetRes.body;

								// Set assertions
								(shopMedicals[0].user._id).should.equal(userId);
								(shopMedicals[0].name).should.match('Shop medical Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Shop medical instance if not logged in', function(done) {
		agent.post('/shop-medicals')
			.send(shopMedical)
			.expect(401)
			.end(function(shopMedicalSaveErr, shopMedicalSaveRes) {
				// Call the assertion callback
				done(shopMedicalSaveErr);
			});
	});

	it('should not be able to save Shop medical instance if no name is provided', function(done) {
		// Invalidate name field
		shopMedical.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop medical
				agent.post('/shop-medicals')
					.send(shopMedical)
					.expect(400)
					.end(function(shopMedicalSaveErr, shopMedicalSaveRes) {
						// Set message assertion
						(shopMedicalSaveRes.body.message).should.match('Please fill Shop medical name');
						
						// Handle Shop medical save error
						done(shopMedicalSaveErr);
					});
			});
	});

	it('should be able to update Shop medical instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop medical
				agent.post('/shop-medicals')
					.send(shopMedical)
					.expect(200)
					.end(function(shopMedicalSaveErr, shopMedicalSaveRes) {
						// Handle Shop medical save error
						if (shopMedicalSaveErr) done(shopMedicalSaveErr);

						// Update Shop medical name
						shopMedical.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Shop medical
						agent.put('/shop-medicals/' + shopMedicalSaveRes.body._id)
							.send(shopMedical)
							.expect(200)
							.end(function(shopMedicalUpdateErr, shopMedicalUpdateRes) {
								// Handle Shop medical update error
								if (shopMedicalUpdateErr) done(shopMedicalUpdateErr);

								// Set assertions
								(shopMedicalUpdateRes.body._id).should.equal(shopMedicalSaveRes.body._id);
								(shopMedicalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Shop medicals if not signed in', function(done) {
		// Create new Shop medical model instance
		var shopMedicalObj = new ShopMedical(shopMedical);

		// Save the Shop medical
		shopMedicalObj.save(function() {
			// Request Shop medicals
			request(app).get('/shop-medicals')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Shop medical if not signed in', function(done) {
		// Create new Shop medical model instance
		var shopMedicalObj = new ShopMedical(shopMedical);

		// Save the Shop medical
		shopMedicalObj.save(function() {
			request(app).get('/shop-medicals/' + shopMedicalObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', shopMedical.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Shop medical instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Shop medical
				agent.post('/shop-medicals')
					.send(shopMedical)
					.expect(200)
					.end(function(shopMedicalSaveErr, shopMedicalSaveRes) {
						// Handle Shop medical save error
						if (shopMedicalSaveErr) done(shopMedicalSaveErr);

						// Delete existing Shop medical
						agent.delete('/shop-medicals/' + shopMedicalSaveRes.body._id)
							.send(shopMedical)
							.expect(200)
							.end(function(shopMedicalDeleteErr, shopMedicalDeleteRes) {
								// Handle Shop medical error error
								if (shopMedicalDeleteErr) done(shopMedicalDeleteErr);

								// Set assertions
								(shopMedicalDeleteRes.body._id).should.equal(shopMedicalSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Shop medical instance if not signed in', function(done) {
		// Set Shop medical user 
		shopMedical.user = user;

		// Create new Shop medical model instance
		var shopMedicalObj = new ShopMedical(shopMedical);

		// Save the Shop medical
		shopMedicalObj.save(function() {
			// Try deleting Shop medical
			request(app).delete('/shop-medicals/' + shopMedicalObj._id)
			.expect(401)
			.end(function(shopMedicalDeleteErr, shopMedicalDeleteRes) {
				// Set message assertion
				(shopMedicalDeleteRes.body.message).should.match('User is not logged in');

				// Handle Shop medical error error
				done(shopMedicalDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ShopMedical.remove().exec();
		done();
	});
});