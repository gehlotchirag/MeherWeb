'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Categorylist = mongoose.model('Categorylist'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, categorylist;

/**
 * Categorylist routes tests
 */
describe('Categorylist CRUD tests', function() {
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

		// Save a user to the test db and create new Categorylist
		user.save(function() {
			categorylist = {
				name: 'Categorylist Name'
			};

			done();
		});
	});

	it('should be able to save Categorylist instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categorylist
				agent.post('/categorylists')
					.send(categorylist)
					.expect(200)
					.end(function(categorylistSaveErr, categorylistSaveRes) {
						// Handle Categorylist save error
						if (categorylistSaveErr) done(categorylistSaveErr);

						// Get a list of Categorylists
						agent.get('/categorylists')
							.end(function(categorylistsGetErr, categorylistsGetRes) {
								// Handle Categorylist save error
								if (categorylistsGetErr) done(categorylistsGetErr);

								// Get Categorylists list
								var categorylists = categorylistsGetRes.body;

								// Set assertions
								(categorylists[0].user._id).should.equal(userId);
								(categorylists[0].name).should.match('Categorylist Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Categorylist instance if not logged in', function(done) {
		agent.post('/categorylists')
			.send(categorylist)
			.expect(401)
			.end(function(categorylistSaveErr, categorylistSaveRes) {
				// Call the assertion callback
				done(categorylistSaveErr);
			});
	});

	it('should not be able to save Categorylist instance if no name is provided', function(done) {
		// Invalidate name field
		categorylist.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categorylist
				agent.post('/categorylists')
					.send(categorylist)
					.expect(400)
					.end(function(categorylistSaveErr, categorylistSaveRes) {
						// Set message assertion
						(categorylistSaveRes.body.message).should.match('Please fill Categorylist name');
						
						// Handle Categorylist save error
						done(categorylistSaveErr);
					});
			});
	});

	it('should be able to update Categorylist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categorylist
				agent.post('/categorylists')
					.send(categorylist)
					.expect(200)
					.end(function(categorylistSaveErr, categorylistSaveRes) {
						// Handle Categorylist save error
						if (categorylistSaveErr) done(categorylistSaveErr);

						// Update Categorylist name
						categorylist.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Categorylist
						agent.put('/categorylists/' + categorylistSaveRes.body._id)
							.send(categorylist)
							.expect(200)
							.end(function(categorylistUpdateErr, categorylistUpdateRes) {
								// Handle Categorylist update error
								if (categorylistUpdateErr) done(categorylistUpdateErr);

								// Set assertions
								(categorylistUpdateRes.body._id).should.equal(categorylistSaveRes.body._id);
								(categorylistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Categorylists if not signed in', function(done) {
		// Create new Categorylist model instance
		var categorylistObj = new Categorylist(categorylist);

		// Save the Categorylist
		categorylistObj.save(function() {
			// Request Categorylists
			request(app).get('/categorylists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Categorylist if not signed in', function(done) {
		// Create new Categorylist model instance
		var categorylistObj = new Categorylist(categorylist);

		// Save the Categorylist
		categorylistObj.save(function() {
			request(app).get('/categorylists/' + categorylistObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', categorylist.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Categorylist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categorylist
				agent.post('/categorylists')
					.send(categorylist)
					.expect(200)
					.end(function(categorylistSaveErr, categorylistSaveRes) {
						// Handle Categorylist save error
						if (categorylistSaveErr) done(categorylistSaveErr);

						// Delete existing Categorylist
						agent.delete('/categorylists/' + categorylistSaveRes.body._id)
							.send(categorylist)
							.expect(200)
							.end(function(categorylistDeleteErr, categorylistDeleteRes) {
								// Handle Categorylist error error
								if (categorylistDeleteErr) done(categorylistDeleteErr);

								// Set assertions
								(categorylistDeleteRes.body._id).should.equal(categorylistSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Categorylist instance if not signed in', function(done) {
		// Set Categorylist user 
		categorylist.user = user;

		// Create new Categorylist model instance
		var categorylistObj = new Categorylist(categorylist);

		// Save the Categorylist
		categorylistObj.save(function() {
			// Try deleting Categorylist
			request(app).delete('/categorylists/' + categorylistObj._id)
			.expect(401)
			.end(function(categorylistDeleteErr, categorylistDeleteRes) {
				// Set message assertion
				(categorylistDeleteRes.body.message).should.match('User is not logged in');

				// Handle Categorylist error error
				done(categorylistDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Categorylist.remove().exec();
		done();
	});
});