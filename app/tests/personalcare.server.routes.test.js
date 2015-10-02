'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Personalcare = mongoose.model('Personalcare'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, personalcare;

/**
 * Personalcare routes tests
 */
describe('Personalcare CRUD tests', function() {
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

		// Save a user to the test db and create new Personalcare
		user.save(function() {
			personalcare = {
				name: 'Personalcare Name'
			};

			done();
		});
	});

	it('should be able to save Personalcare instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Personalcare
				agent.post('/personalcares')
					.send(personalcare)
					.expect(200)
					.end(function(personalcareSaveErr, personalcareSaveRes) {
						// Handle Personalcare save error
						if (personalcareSaveErr) done(personalcareSaveErr);

						// Get a list of Personalcares
						agent.get('/personalcares')
							.end(function(personalcaresGetErr, personalcaresGetRes) {
								// Handle Personalcare save error
								if (personalcaresGetErr) done(personalcaresGetErr);

								// Get Personalcares list
								var personalcares = personalcaresGetRes.body;

								// Set assertions
								(personalcares[0].user._id).should.equal(userId);
								(personalcares[0].name).should.match('Personalcare Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Personalcare instance if not logged in', function(done) {
		agent.post('/personalcares')
			.send(personalcare)
			.expect(401)
			.end(function(personalcareSaveErr, personalcareSaveRes) {
				// Call the assertion callback
				done(personalcareSaveErr);
			});
	});

	it('should not be able to save Personalcare instance if no name is provided', function(done) {
		// Invalidate name field
		personalcare.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Personalcare
				agent.post('/personalcares')
					.send(personalcare)
					.expect(400)
					.end(function(personalcareSaveErr, personalcareSaveRes) {
						// Set message assertion
						(personalcareSaveRes.body.message).should.match('Please fill Personalcare name');
						
						// Handle Personalcare save error
						done(personalcareSaveErr);
					});
			});
	});

	it('should be able to update Personalcare instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Personalcare
				agent.post('/personalcares')
					.send(personalcare)
					.expect(200)
					.end(function(personalcareSaveErr, personalcareSaveRes) {
						// Handle Personalcare save error
						if (personalcareSaveErr) done(personalcareSaveErr);

						// Update Personalcare name
						personalcare.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Personalcare
						agent.put('/personalcares/' + personalcareSaveRes.body._id)
							.send(personalcare)
							.expect(200)
							.end(function(personalcareUpdateErr, personalcareUpdateRes) {
								// Handle Personalcare update error
								if (personalcareUpdateErr) done(personalcareUpdateErr);

								// Set assertions
								(personalcareUpdateRes.body._id).should.equal(personalcareSaveRes.body._id);
								(personalcareUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Personalcares if not signed in', function(done) {
		// Create new Personalcare model instance
		var personalcareObj = new Personalcare(personalcare);

		// Save the Personalcare
		personalcareObj.save(function() {
			// Request Personalcares
			request(app).get('/personalcares')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Personalcare if not signed in', function(done) {
		// Create new Personalcare model instance
		var personalcareObj = new Personalcare(personalcare);

		// Save the Personalcare
		personalcareObj.save(function() {
			request(app).get('/personalcares/' + personalcareObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', personalcare.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Personalcare instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Personalcare
				agent.post('/personalcares')
					.send(personalcare)
					.expect(200)
					.end(function(personalcareSaveErr, personalcareSaveRes) {
						// Handle Personalcare save error
						if (personalcareSaveErr) done(personalcareSaveErr);

						// Delete existing Personalcare
						agent.delete('/personalcares/' + personalcareSaveRes.body._id)
							.send(personalcare)
							.expect(200)
							.end(function(personalcareDeleteErr, personalcareDeleteRes) {
								// Handle Personalcare error error
								if (personalcareDeleteErr) done(personalcareDeleteErr);

								// Set assertions
								(personalcareDeleteRes.body._id).should.equal(personalcareSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Personalcare instance if not signed in', function(done) {
		// Set Personalcare user 
		personalcare.user = user;

		// Create new Personalcare model instance
		var personalcareObj = new Personalcare(personalcare);

		// Save the Personalcare
		personalcareObj.save(function() {
			// Try deleting Personalcare
			request(app).delete('/personalcares/' + personalcareObj._id)
			.expect(401)
			.end(function(personalcareDeleteErr, personalcareDeleteRes) {
				// Set message assertion
				(personalcareDeleteRes.body.message).should.match('User is not logged in');

				// Handle Personalcare error error
				done(personalcareDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Personalcare.remove().exec();
		done();
	});
});