'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Calldetail = mongoose.model('Calldetail'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, calldetail;

/**
 * Calldetail routes tests
 */
describe('Calldetail CRUD tests', function() {
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

		// Save a user to the test db and create new Calldetail
		user.save(function() {
			calldetail = {
				name: 'Calldetail Name'
			};

			done();
		});
	});

	it('should be able to save Calldetail instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calldetail
				agent.post('/calldetails')
					.send(calldetail)
					.expect(200)
					.end(function(calldetailSaveErr, calldetailSaveRes) {
						// Handle Calldetail save error
						if (calldetailSaveErr) done(calldetailSaveErr);

						// Get a list of Calldetails
						agent.get('/calldetails')
							.end(function(calldetailsGetErr, calldetailsGetRes) {
								// Handle Calldetail save error
								if (calldetailsGetErr) done(calldetailsGetErr);

								// Get Calldetails list
								var calldetails = calldetailsGetRes.body;

								// Set assertions
								(calldetails[0].user._id).should.equal(userId);
								(calldetails[0].name).should.match('Calldetail Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Calldetail instance if not logged in', function(done) {
		agent.post('/calldetails')
			.send(calldetail)
			.expect(401)
			.end(function(calldetailSaveErr, calldetailSaveRes) {
				// Call the assertion callback
				done(calldetailSaveErr);
			});
	});

	it('should not be able to save Calldetail instance if no name is provided', function(done) {
		// Invalidate name field
		calldetail.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calldetail
				agent.post('/calldetails')
					.send(calldetail)
					.expect(400)
					.end(function(calldetailSaveErr, calldetailSaveRes) {
						// Set message assertion
						(calldetailSaveRes.body.message).should.match('Please fill Calldetail name');
						
						// Handle Calldetail save error
						done(calldetailSaveErr);
					});
			});
	});

	it('should be able to update Calldetail instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calldetail
				agent.post('/calldetails')
					.send(calldetail)
					.expect(200)
					.end(function(calldetailSaveErr, calldetailSaveRes) {
						// Handle Calldetail save error
						if (calldetailSaveErr) done(calldetailSaveErr);

						// Update Calldetail name
						calldetail.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Calldetail
						agent.put('/calldetails/' + calldetailSaveRes.body._id)
							.send(calldetail)
							.expect(200)
							.end(function(calldetailUpdateErr, calldetailUpdateRes) {
								// Handle Calldetail update error
								if (calldetailUpdateErr) done(calldetailUpdateErr);

								// Set assertions
								(calldetailUpdateRes.body._id).should.equal(calldetailSaveRes.body._id);
								(calldetailUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Calldetails if not signed in', function(done) {
		// Create new Calldetail model instance
		var calldetailObj = new Calldetail(calldetail);

		// Save the Calldetail
		calldetailObj.save(function() {
			// Request Calldetails
			request(app).get('/calldetails')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Calldetail if not signed in', function(done) {
		// Create new Calldetail model instance
		var calldetailObj = new Calldetail(calldetail);

		// Save the Calldetail
		calldetailObj.save(function() {
			request(app).get('/calldetails/' + calldetailObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', calldetail.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Calldetail instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calldetail
				agent.post('/calldetails')
					.send(calldetail)
					.expect(200)
					.end(function(calldetailSaveErr, calldetailSaveRes) {
						// Handle Calldetail save error
						if (calldetailSaveErr) done(calldetailSaveErr);

						// Delete existing Calldetail
						agent.delete('/calldetails/' + calldetailSaveRes.body._id)
							.send(calldetail)
							.expect(200)
							.end(function(calldetailDeleteErr, calldetailDeleteRes) {
								// Handle Calldetail error error
								if (calldetailDeleteErr) done(calldetailDeleteErr);

								// Set assertions
								(calldetailDeleteRes.body._id).should.equal(calldetailSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Calldetail instance if not signed in', function(done) {
		// Set Calldetail user 
		calldetail.user = user;

		// Create new Calldetail model instance
		var calldetailObj = new Calldetail(calldetail);

		// Save the Calldetail
		calldetailObj.save(function() {
			// Try deleting Calldetail
			request(app).delete('/calldetails/' + calldetailObj._id)
			.expect(401)
			.end(function(calldetailDeleteErr, calldetailDeleteRes) {
				// Set message assertion
				(calldetailDeleteRes.body.message).should.match('User is not logged in');

				// Handle Calldetail error error
				done(calldetailDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Calldetail.remove().exec();
		done();
	});
});