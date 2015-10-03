'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ShopFruit = mongoose.model('ShopFruit');

/**
 * Globals
 */
var user, shopFruit;

/**
 * Unit tests
 */
describe('Shop fruit Model Unit Tests:', function() {
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
			shopFruit = new ShopFruit({
				name: 'Shop fruit Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return shopFruit.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			shopFruit.name = '';

			return shopFruit.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ShopFruit.remove().exec();
		User.remove().exec();

		done();
	});
});