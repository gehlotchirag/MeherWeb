'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SproutsVegetable = mongoose.model('SproutsVegetable');

/**
 * Globals
 */
var user, sproutsVegetable;

/**
 * Unit tests
 */
describe('Sprouts vegetable Model Unit Tests:', function() {
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
			sproutsVegetable = new SproutsVegetable({
				name: 'Sprouts vegetable Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return sproutsVegetable.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			sproutsVegetable.name = '';

			return sproutsVegetable.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		SproutsVegetable.remove().exec();
		User.remove().exec();

		done();
	});
});