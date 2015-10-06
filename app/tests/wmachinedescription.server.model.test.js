'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wmachinedescription = mongoose.model('Wmachinedescription');

/**
 * Globals
 */
var user, wmachinedescription;

/**
 * Unit tests
 */
describe('Wmachinedescription Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			wmachinedescription = new Wmachinedescription({
				name: 'Wmachinedescription Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return wmachinedescription.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			wmachinedescription.name = '';

			return wmachinedescription.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Wmachinedescription.remove().exec();
		User.remove().exec();

		done();
	});
});