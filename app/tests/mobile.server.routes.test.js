'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mobile = mongoose.model('Mobile'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, mobile;

/**
 * Mobile routes tests
 */
describe('Mobile CRUD tests', function() {
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

		// Save a user to the test db and create new Mobile
		user.save(function() {
			mobile = {
				name: 'Mobile Name'
			};

			done();
		});
	});

	it('should be able to save Mobile instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mobile
				agent.post('/mobiles')
					.send(mobile)
					.expect(200)
					.end(function(mobileSaveErr, mobileSaveRes) {
						// Handle Mobile save error
						if (mobileSaveErr) done(mobileSaveErr);

						// Get a list of Mobiles
						agent.get('/mobiles')
							.end(function(mobilesGetErr, mobilesGetRes) {
								// Handle Mobile save error
								if (mobilesGetErr) done(mobilesGetErr);

								// Get Mobiles list
								var mobiles = mobilesGetRes.body;

								// Set assertions
								(mobiles[0].user._id).should.equal(userId);
								(mobiles[0].name).should.match('Mobile Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Mobile instance if not logged in', function(done) {
		agent.post('/mobiles')
			.send(mobile)
			.expect(401)
			.end(function(mobileSaveErr, mobileSaveRes) {
				// Call the assertion callback
				done(mobileSaveErr);
			});
	});

	it('should not be able to save Mobile instance if no name is provided', function(done) {
		// Invalidate name field
		mobile.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mobile
				agent.post('/mobiles')
					.send(mobile)
					.expect(400)
					.end(function(mobileSaveErr, mobileSaveRes) {
						// Set message assertion
						(mobileSaveRes.body.message).should.match('Please fill Mobile name');
						
						// Handle Mobile save error
						done(mobileSaveErr);
					});
			});
	});

	it('should be able to update Mobile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mobile
				agent.post('/mobiles')
					.send(mobile)
					.expect(200)
					.end(function(mobileSaveErr, mobileSaveRes) {
						// Handle Mobile save error
						if (mobileSaveErr) done(mobileSaveErr);

						// Update Mobile name
						mobile.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Mobile
						agent.put('/mobiles/' + mobileSaveRes.body._id)
							.send(mobile)
							.expect(200)
							.end(function(mobileUpdateErr, mobileUpdateRes) {
								// Handle Mobile update error
								if (mobileUpdateErr) done(mobileUpdateErr);

								// Set assertions
								(mobileUpdateRes.body._id).should.equal(mobileSaveRes.body._id);
								(mobileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Mobiles if not signed in', function(done) {
		// Create new Mobile model instance
		var mobileObj = new Mobile(mobile);

		// Save the Mobile
		mobileObj.save(function() {
			// Request Mobiles
			request(app).get('/mobiles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Mobile if not signed in', function(done) {
		// Create new Mobile model instance
		var mobileObj = new Mobile(mobile);

		// Save the Mobile
		mobileObj.save(function() {
			request(app).get('/mobiles/' + mobileObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', mobile.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Mobile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mobile
				agent.post('/mobiles')
					.send(mobile)
					.expect(200)
					.end(function(mobileSaveErr, mobileSaveRes) {
						// Handle Mobile save error
						if (mobileSaveErr) done(mobileSaveErr);

						// Delete existing Mobile
						agent.delete('/mobiles/' + mobileSaveRes.body._id)
							.send(mobile)
							.expect(200)
							.end(function(mobileDeleteErr, mobileDeleteRes) {
								// Handle Mobile error error
								if (mobileDeleteErr) done(mobileDeleteErr);

								// Set assertions
								(mobileDeleteRes.body._id).should.equal(mobileSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Mobile instance if not signed in', function(done) {
		// Set Mobile user 
		mobile.user = user;

		// Create new Mobile model instance
		var mobileObj = new Mobile(mobile);

		// Save the Mobile
		mobileObj.save(function() {
			// Try deleting Mobile
			request(app).delete('/mobiles/' + mobileObj._id)
			.expect(401)
			.end(function(mobileDeleteErr, mobileDeleteRes) {
				// Set message assertion
				(mobileDeleteRes.body.message).should.match('User is not logged in');

				// Handle Mobile error error
				done(mobileDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Mobile.remove().exec();
		done();
	});
});