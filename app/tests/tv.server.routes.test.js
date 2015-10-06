'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tv = mongoose.model('Tv'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tv;

/**
 * Tv routes tests
 */
describe('Tv CRUD tests', function() {
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

		// Save a user to the test db and create new Tv
		user.save(function() {
			tv = {
				name: 'Tv Name'
			};

			done();
		});
	});

	it('should be able to save Tv instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tv
				agent.post('/tvs')
					.send(tv)
					.expect(200)
					.end(function(tvSaveErr, tvSaveRes) {
						// Handle Tv save error
						if (tvSaveErr) done(tvSaveErr);

						// Get a list of Tvs
						agent.get('/tvs')
							.end(function(tvsGetErr, tvsGetRes) {
								// Handle Tv save error
								if (tvsGetErr) done(tvsGetErr);

								// Get Tvs list
								var tvs = tvsGetRes.body;

								// Set assertions
								(tvs[0].user._id).should.equal(userId);
								(tvs[0].name).should.match('Tv Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tv instance if not logged in', function(done) {
		agent.post('/tvs')
			.send(tv)
			.expect(401)
			.end(function(tvSaveErr, tvSaveRes) {
				// Call the assertion callback
				done(tvSaveErr);
			});
	});

	it('should not be able to save Tv instance if no name is provided', function(done) {
		// Invalidate name field
		tv.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tv
				agent.post('/tvs')
					.send(tv)
					.expect(400)
					.end(function(tvSaveErr, tvSaveRes) {
						// Set message assertion
						(tvSaveRes.body.message).should.match('Please fill Tv name');
						
						// Handle Tv save error
						done(tvSaveErr);
					});
			});
	});

	it('should be able to update Tv instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tv
				agent.post('/tvs')
					.send(tv)
					.expect(200)
					.end(function(tvSaveErr, tvSaveRes) {
						// Handle Tv save error
						if (tvSaveErr) done(tvSaveErr);

						// Update Tv name
						tv.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tv
						agent.put('/tvs/' + tvSaveRes.body._id)
							.send(tv)
							.expect(200)
							.end(function(tvUpdateErr, tvUpdateRes) {
								// Handle Tv update error
								if (tvUpdateErr) done(tvUpdateErr);

								// Set assertions
								(tvUpdateRes.body._id).should.equal(tvSaveRes.body._id);
								(tvUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tvs if not signed in', function(done) {
		// Create new Tv model instance
		var tvObj = new Tv(tv);

		// Save the Tv
		tvObj.save(function() {
			// Request Tvs
			request(app).get('/tvs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tv if not signed in', function(done) {
		// Create new Tv model instance
		var tvObj = new Tv(tv);

		// Save the Tv
		tvObj.save(function() {
			request(app).get('/tvs/' + tvObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tv.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tv instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tv
				agent.post('/tvs')
					.send(tv)
					.expect(200)
					.end(function(tvSaveErr, tvSaveRes) {
						// Handle Tv save error
						if (tvSaveErr) done(tvSaveErr);

						// Delete existing Tv
						agent.delete('/tvs/' + tvSaveRes.body._id)
							.send(tv)
							.expect(200)
							.end(function(tvDeleteErr, tvDeleteRes) {
								// Handle Tv error error
								if (tvDeleteErr) done(tvDeleteErr);

								// Set assertions
								(tvDeleteRes.body._id).should.equal(tvSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tv instance if not signed in', function(done) {
		// Set Tv user 
		tv.user = user;

		// Create new Tv model instance
		var tvObj = new Tv(tv);

		// Save the Tv
		tvObj.save(function() {
			// Try deleting Tv
			request(app).delete('/tvs/' + tvObj._id)
			.expect(401)
			.end(function(tvDeleteErr, tvDeleteRes) {
				// Set message assertion
				(tvDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tv error error
				done(tvDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tv.remove().exec();
		done();
	});
});