'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ShopElectronic = mongoose.model('ShopElectronic');

/**
 * Globals
 */
var user, shopElectronic;

/**
 * Unit tests
 */
describe('Shop electronic Model Unit Tests:', function() {
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
			shopElectronic = new ShopElectronic({
				name: 'Shop electronic Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return shopElectronic.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			shopElectronic.name = '';

			return shopElectronic.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ShopElectronic.remove().exec();
		User.remove().exec();

		done();
	});
});