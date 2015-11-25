'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Reminder = mongoose.model('Reminder'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, reminder;

/**
 * Reminder routes tests
 */
describe('Reminder CRUD tests', function() {
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

		// Save a user to the test db and create new Reminder
		user.save(function() {
			reminder = {
				name: 'Reminder Name'
			};

			done();
		});
	});

	it('should be able to save Reminder instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reminder
				agent.post('/reminders')
					.send(reminder)
					.expect(200)
					.end(function(reminderSaveErr, reminderSaveRes) {
						// Handle Reminder save error
						if (reminderSaveErr) done(reminderSaveErr);

						// Get a list of Reminders
						agent.get('/reminders')
							.end(function(remindersGetErr, remindersGetRes) {
								// Handle Reminder save error
								if (remindersGetErr) done(remindersGetErr);

								// Get Reminders list
								var reminders = remindersGetRes.body;

								// Set assertions
								(reminders[0].user._id).should.equal(userId);
								(reminders[0].name).should.match('Reminder Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Reminder instance if not logged in', function(done) {
		agent.post('/reminders')
			.send(reminder)
			.expect(401)
			.end(function(reminderSaveErr, reminderSaveRes) {
				// Call the assertion callback
				done(reminderSaveErr);
			});
	});

	it('should not be able to save Reminder instance if no name is provided', function(done) {
		// Invalidate name field
		reminder.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reminder
				agent.post('/reminders')
					.send(reminder)
					.expect(400)
					.end(function(reminderSaveErr, reminderSaveRes) {
						// Set message assertion
						(reminderSaveRes.body.message).should.match('Please fill Reminder name');
						
						// Handle Reminder save error
						done(reminderSaveErr);
					});
			});
	});

	it('should be able to update Reminder instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reminder
				agent.post('/reminders')
					.send(reminder)
					.expect(200)
					.end(function(reminderSaveErr, reminderSaveRes) {
						// Handle Reminder save error
						if (reminderSaveErr) done(reminderSaveErr);

						// Update Reminder name
						reminder.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Reminder
						agent.put('/reminders/' + reminderSaveRes.body._id)
							.send(reminder)
							.expect(200)
							.end(function(reminderUpdateErr, reminderUpdateRes) {
								// Handle Reminder update error
								if (reminderUpdateErr) done(reminderUpdateErr);

								// Set assertions
								(reminderUpdateRes.body._id).should.equal(reminderSaveRes.body._id);
								(reminderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Reminders if not signed in', function(done) {
		// Create new Reminder model instance
		var reminderObj = new Reminder(reminder);

		// Save the Reminder
		reminderObj.save(function() {
			// Request Reminders
			request(app).get('/reminders')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Reminder if not signed in', function(done) {
		// Create new Reminder model instance
		var reminderObj = new Reminder(reminder);

		// Save the Reminder
		reminderObj.save(function() {
			request(app).get('/reminders/' + reminderObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', reminder.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Reminder instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reminder
				agent.post('/reminders')
					.send(reminder)
					.expect(200)
					.end(function(reminderSaveErr, reminderSaveRes) {
						// Handle Reminder save error
						if (reminderSaveErr) done(reminderSaveErr);

						// Delete existing Reminder
						agent.delete('/reminders/' + reminderSaveRes.body._id)
							.send(reminder)
							.expect(200)
							.end(function(reminderDeleteErr, reminderDeleteRes) {
								// Handle Reminder error error
								if (reminderDeleteErr) done(reminderDeleteErr);

								// Set assertions
								(reminderDeleteRes.body._id).should.equal(reminderSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Reminder instance if not signed in', function(done) {
		// Set Reminder user 
		reminder.user = user;

		// Create new Reminder model instance
		var reminderObj = new Reminder(reminder);

		// Save the Reminder
		reminderObj.save(function() {
			// Try deleting Reminder
			request(app).delete('/reminders/' + reminderObj._id)
			.expect(401)
			.end(function(reminderDeleteErr, reminderDeleteRes) {
				// Set message assertion
				(reminderDeleteRes.body.message).should.match('User is not logged in');

				// Handle Reminder error error
				done(reminderDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Reminder.remove().exec();
		done();
	});
});