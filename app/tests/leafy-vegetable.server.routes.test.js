'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LeafyVegetable = mongoose.model('LeafyVegetable'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, leafyVegetable;

/**
 * Leafy vegetable routes tests
 */
describe('Leafy vegetable CRUD tests', function() {
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

		// Save a user to the test db and create new Leafy vegetable
		user.save(function() {
			leafyVegetable = {
				name: 'Leafy vegetable Name'
			};

			done();
		});
	});

	it('should be able to save Leafy vegetable instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Leafy vegetable
				agent.post('/leafy-vegetables')
					.send(leafyVegetable)
					.expect(200)
					.end(function(leafyVegetableSaveErr, leafyVegetableSaveRes) {
						// Handle Leafy vegetable save error
						if (leafyVegetableSaveErr) done(leafyVegetableSaveErr);

						// Get a list of Leafy vegetables
						agent.get('/leafy-vegetables')
							.end(function(leafyVegetablesGetErr, leafyVegetablesGetRes) {
								// Handle Leafy vegetable save error
								if (leafyVegetablesGetErr) done(leafyVegetablesGetErr);

								// Get Leafy vegetables list
								var leafyVegetables = leafyVegetablesGetRes.body;

								// Set assertions
								(leafyVegetables[0].user._id).should.equal(userId);
								(leafyVegetables[0].name).should.match('Leafy vegetable Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Leafy vegetable instance if not logged in', function(done) {
		agent.post('/leafy-vegetables')
			.send(leafyVegetable)
			.expect(401)
			.end(function(leafyVegetableSaveErr, leafyVegetableSaveRes) {
				// Call the assertion callback
				done(leafyVegetableSaveErr);
			});
	});

	it('should not be able to save Leafy vegetable instance if no name is provided', function(done) {
		// Invalidate name field
		leafyVegetable.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Leafy vegetable
				agent.post('/leafy-vegetables')
					.send(leafyVegetable)
					.expect(400)
					.end(function(leafyVegetableSaveErr, leafyVegetableSaveRes) {
						// Set message assertion
						(leafyVegetableSaveRes.body.message).should.match('Please fill Leafy vegetable name');
						
						// Handle Leafy vegetable save error
						done(leafyVegetableSaveErr);
					});
			});
	});

	it('should be able to update Leafy vegetable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Leafy vegetable
				agent.post('/leafy-vegetables')
					.send(leafyVegetable)
					.expect(200)
					.end(function(leafyVegetableSaveErr, leafyVegetableSaveRes) {
						// Handle Leafy vegetable save error
						if (leafyVegetableSaveErr) done(leafyVegetableSaveErr);

						// Update Leafy vegetable name
						leafyVegetable.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Leafy vegetable
						agent.put('/leafy-vegetables/' + leafyVegetableSaveRes.body._id)
							.send(leafyVegetable)
							.expect(200)
							.end(function(leafyVegetableUpdateErr, leafyVegetableUpdateRes) {
								// Handle Leafy vegetable update error
								if (leafyVegetableUpdateErr) done(leafyVegetableUpdateErr);

								// Set assertions
								(leafyVegetableUpdateRes.body._id).should.equal(leafyVegetableSaveRes.body._id);
								(leafyVegetableUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Leafy vegetables if not signed in', function(done) {
		// Create new Leafy vegetable model instance
		var leafyVegetableObj = new LeafyVegetable(leafyVegetable);

		// Save the Leafy vegetable
		leafyVegetableObj.save(function() {
			// Request Leafy vegetables
			request(app).get('/leafy-vegetables')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Leafy vegetable if not signed in', function(done) {
		// Create new Leafy vegetable model instance
		var leafyVegetableObj = new LeafyVegetable(leafyVegetable);

		// Save the Leafy vegetable
		leafyVegetableObj.save(function() {
			request(app).get('/leafy-vegetables/' + leafyVegetableObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', leafyVegetable.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Leafy vegetable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Leafy vegetable
				agent.post('/leafy-vegetables')
					.send(leafyVegetable)
					.expect(200)
					.end(function(leafyVegetableSaveErr, leafyVegetableSaveRes) {
						// Handle Leafy vegetable save error
						if (leafyVegetableSaveErr) done(leafyVegetableSaveErr);

						// Delete existing Leafy vegetable
						agent.delete('/leafy-vegetables/' + leafyVegetableSaveRes.body._id)
							.send(leafyVegetable)
							.expect(200)
							.end(function(leafyVegetableDeleteErr, leafyVegetableDeleteRes) {
								// Handle Leafy vegetable error error
								if (leafyVegetableDeleteErr) done(leafyVegetableDeleteErr);

								// Set assertions
								(leafyVegetableDeleteRes.body._id).should.equal(leafyVegetableSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Leafy vegetable instance if not signed in', function(done) {
		// Set Leafy vegetable user 
		leafyVegetable.user = user;

		// Create new Leafy vegetable model instance
		var leafyVegetableObj = new LeafyVegetable(leafyVegetable);

		// Save the Leafy vegetable
		leafyVegetableObj.save(function() {
			// Try deleting Leafy vegetable
			request(app).delete('/leafy-vegetables/' + leafyVegetableObj._id)
			.expect(401)
			.end(function(leafyVegetableDeleteErr, leafyVegetableDeleteRes) {
				// Set message assertion
				(leafyVegetableDeleteRes.body.message).should.match('User is not logged in');

				// Handle Leafy vegetable error error
				done(leafyVegetableDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LeafyVegetable.remove().exec();
		done();
	});
});