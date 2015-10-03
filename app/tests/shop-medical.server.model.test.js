'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ShopMedical = mongoose.model('ShopMedical');

/**
 * Globals
 */
var user, shopMedical;

/**
 * Unit tests
 */
describe('Shop medical Model Unit Tests:', function() {
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
			shopMedical = new ShopMedical({
				name: 'Shop medical Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return shopMedical.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			shopMedical.name = '';

			return shopMedical.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ShopMedical.remove().exec();
		User.remove().exec();

		done();
	});
});