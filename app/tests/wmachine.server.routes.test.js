'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wmachine = mongoose.model('Wmachine'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, wmachine;

/**
 * Wmachine routes tests
 */
describe('Wmachine CRUD tests', function() {
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

		// Save a user to the test db and create new Wmachine
		user.save(function() {
			wmachine = {
				name: 'Wmachine Name'
			};

			done();
		});
	});

	it('should be able to save Wmachine instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wmachine
				agent.post('/wmachines')
					.send(wmachine)
					.expect(200)
					.end(function(wmachineSaveErr, wmachineSaveRes) {
						// Handle Wmachine save error
						if (wmachineSaveErr) done(wmachineSaveErr);

						// Get a list of Wmachines
						agent.get('/wmachines')
							.end(function(wmachinesGetErr, wmachinesGetRes) {
								// Handle Wmachine save error
								if (wmachinesGetErr) done(wmachinesGetErr);

								// Get Wmachines list
								var wmachines = wmachinesGetRes.body;

								// Set assertions
								(wmachines[0].user._id).should.equal(userId);
								(wmachines[0].name).should.match('Wmachine Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Wmachine instance if not logged in', function(done) {
		agent.post('/wmachines')
			.send(wmachine)
			.expect(401)
			.end(function(wmachineSaveErr, wmachineSaveRes) {
				// Call the assertion callback
				done(wmachineSaveErr);
			});
	});

	it('should not be able to save Wmachine instance if no name is provided', function(done) {
		// Invalidate name field
		wmachine.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wmachine
				agent.post('/wmachines')
					.send(wmachine)
					.expect(400)
					.end(function(wmachineSaveErr, wmachineSaveRes) {
						// Set message assertion
						(wmachineSaveRes.body.message).should.match('Please fill Wmachine name');
						
						// Handle Wmachine save error
						done(wmachineSaveErr);
					});
			});
	});

	it('should be able to update Wmachine instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wmachine
				agent.post('/wmachines')
					.send(wmachine)
					.expect(200)
					.end(function(wmachineSaveErr, wmachineSaveRes) {
						// Handle Wmachine save error
						if (wmachineSaveErr) done(wmachineSaveErr);

						// Update Wmachine name
						wmachine.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Wmachine
						agent.put('/wmachines/' + wmachineSaveRes.body._id)
							.send(wmachine)
							.expect(200)
							.end(function(wmachineUpdateErr, wmachineUpdateRes) {
								// Handle Wmachine update error
								if (wmachineUpdateErr) done(wmachineUpdateErr);

								// Set assertions
								(wmachineUpdateRes.body._id).should.equal(wmachineSaveRes.body._id);
								(wmachineUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Wmachines if not signed in', function(done) {
		// Create new Wmachine model instance
		var wmachineObj = new Wmachine(wmachine);

		// Save the Wmachine
		wmachineObj.save(function() {
			// Request Wmachines
			request(app).get('/wmachines')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Wmachine if not signed in', function(done) {
		// Create new Wmachine model instance
		var wmachineObj = new Wmachine(wmachine);

		// Save the Wmachine
		wmachineObj.save(function() {
			request(app).get('/wmachines/' + wmachineObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', wmachine.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Wmachine instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wmachine
				agent.post('/wmachines')
					.send(wmachine)
					.expect(200)
					.end(function(wmachineSaveErr, wmachineSaveRes) {
						// Handle Wmachine save error
						if (wmachineSaveErr) done(wmachineSaveErr);

						// Delete existing Wmachine
						agent.delete('/wmachines/' + wmachineSaveRes.body._id)
							.send(wmachine)
							.expect(200)
							.end(function(wmachineDeleteErr, wmachineDeleteRes) {
								// Handle Wmachine error error
								if (wmachineDeleteErr) done(wmachineDeleteErr);

								// Set assertions
								(wmachineDeleteRes.body._id).should.equal(wmachineSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Wmachine instance if not signed in', function(done) {
		// Set Wmachine user 
		wmachine.user = user;

		// Create new Wmachine model instance
		var wmachineObj = new Wmachine(wmachine);

		// Save the Wmachine
		wmachineObj.save(function() {
			// Try deleting Wmachine
			request(app).delete('/wmachines/' + wmachineObj._id)
			.expect(401)
			.end(function(wmachineDeleteErr, wmachineDeleteRes) {
				// Set message assertion
				(wmachineDeleteRes.body.message).should.match('User is not logged in');

				// Handle Wmachine error error
				done(wmachineDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Wmachine.remove().exec();
		done();
	});
});