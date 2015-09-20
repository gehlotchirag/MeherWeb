'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ShopGrocery = mongoose.model('ShopGrocery');

/**
 * Globals
 */
var user, shopGrocery;

/**
 * Unit tests
 */
describe('Shop grocery Model Unit Tests:', function() {
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
			shopGrocery = new ShopGrocery({
				name: 'Shop grocery Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return shopGrocery.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			shopGrocery.name = '';

			return shopGrocery.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ShopGrocery.remove().exec();
		User.remove().exec();

		done();
	});
});