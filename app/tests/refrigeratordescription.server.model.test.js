'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Refrigeratordescription = mongoose.model('Refrigeratordescription');

/**
 * Globals
 */
var user, refrigeratordescription;

/**
 * Unit tests
 */
describe('Refrigeratordescription Model Unit Tests:', function() {
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
			refrigeratordescription = new Refrigeratordescription({
				name: 'Refrigeratordescription Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return refrigeratordescription.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			refrigeratordescription.name = '';

			return refrigeratordescription.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Refrigeratordescription.remove().exec();
		User.remove().exec();

		done();
	});
});