'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LeafyVegetable = mongoose.model('LeafyVegetable');

/**
 * Globals
 */
var user, leafyVegetable;

/**
 * Unit tests
 */
describe('Leafy vegetable Model Unit Tests:', function() {
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
			leafyVegetable = new LeafyVegetable({
				name: 'Leafy vegetable Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return leafyVegetable.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			leafyVegetable.name = '';

			return leafyVegetable.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		LeafyVegetable.remove().exec();
		User.remove().exec();

		done();
	});
});