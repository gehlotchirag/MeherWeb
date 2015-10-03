'use strict';

(function() {
	// Shop fruits Controller Spec
	describe('Shop fruits Controller Tests', function() {
		// Initialize global variables
		var ShopFruitsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Shop fruits controller.
			ShopFruitsController = $controller('ShopFruitsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Shop fruit object fetched from XHR', inject(function(ShopFruits) {
			// Create sample Shop fruit using the Shop fruits service
			var sampleShopFruit = new ShopFruits({
				name: 'New Shop fruit'
			});

			// Create a sample Shop fruits array that includes the new Shop fruit
			var sampleShopFruits = [sampleShopFruit];

			// Set GET response
			$httpBackend.expectGET('shop-fruits').respond(sampleShopFruits);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shopFruits).toEqualData(sampleShopFruits);
		}));

		it('$scope.findOne() should create an array with one Shop fruit object fetched from XHR using a shopFruitId URL parameter', inject(function(ShopFruits) {
			// Define a sample Shop fruit object
			var sampleShopFruit = new ShopFruits({
				name: 'New Shop fruit'
			});

			// Set the URL parameter
			$stateParams.shopFruitId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/shop-fruits\/([0-9a-fA-F]{24})$/).respond(sampleShopFruit);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shopFruit).toEqualData(sampleShopFruit);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ShopFruits) {
			// Create a sample Shop fruit object
			var sampleShopFruitPostData = new ShopFruits({
				name: 'New Shop fruit'
			});

			// Create a sample Shop fruit response
			var sampleShopFruitResponse = new ShopFruits({
				_id: '525cf20451979dea2c000001',
				name: 'New Shop fruit'
			});

			// Fixture mock form input values
			scope.name = 'New Shop fruit';

			// Set POST response
			$httpBackend.expectPOST('shop-fruits', sampleShopFruitPostData).respond(sampleShopFruitResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Shop fruit was created
			expect($location.path()).toBe('/shop-fruits/' + sampleShopFruitResponse._id);
		}));

		it('$scope.update() should update a valid Shop fruit', inject(function(ShopFruits) {
			// Define a sample Shop fruit put data
			var sampleShopFruitPutData = new ShopFruits({
				_id: '525cf20451979dea2c000001',
				name: 'New Shop fruit'
			});

			// Mock Shop fruit in scope
			scope.shopFruit = sampleShopFruitPutData;

			// Set PUT response
			$httpBackend.expectPUT(/shop-fruits\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/shop-fruits/' + sampleShopFruitPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid shopFruitId and remove the Shop fruit from the scope', inject(function(ShopFruits) {
			// Create new Shop fruit object
			var sampleShopFruit = new ShopFruits({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Shop fruits array and include the Shop fruit
			scope.shopFruits = [sampleShopFruit];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/shop-fruits\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleShopFruit);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.shopFruits.length).toBe(0);
		}));
	});
}());