'use strict';

(function() {
	// Shop groceries Controller Spec
	describe('Shop groceries Controller Tests', function() {
		// Initialize global variables
		var ShopGroceriesController,
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

			// Initialize the Shop groceries controller.
			ShopGroceriesController = $controller('ShopGroceriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Shop grocery object fetched from XHR', inject(function(ShopGroceries) {
			// Create sample Shop grocery using the Shop groceries service
			var sampleShopGrocery = new ShopGroceries({
				name: 'New Shop grocery'
			});

			// Create a sample Shop groceries array that includes the new Shop grocery
			var sampleShopGroceries = [sampleShopGrocery];

			// Set GET response
			$httpBackend.expectGET('shop-groceries').respond(sampleShopGroceries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shopGroceries).toEqualData(sampleShopGroceries);
		}));

		it('$scope.findOne() should create an array with one Shop grocery object fetched from XHR using a shopGroceryId URL parameter', inject(function(ShopGroceries) {
			// Define a sample Shop grocery object
			var sampleShopGrocery = new ShopGroceries({
				name: 'New Shop grocery'
			});

			// Set the URL parameter
			$stateParams.shopGroceryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/shop-groceries\/([0-9a-fA-F]{24})$/).respond(sampleShopGrocery);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shopGrocery).toEqualData(sampleShopGrocery);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ShopGroceries) {
			// Create a sample Shop grocery object
			var sampleShopGroceryPostData = new ShopGroceries({
				name: 'New Shop grocery'
			});

			// Create a sample Shop grocery response
			var sampleShopGroceryResponse = new ShopGroceries({
				_id: '525cf20451979dea2c000001',
				name: 'New Shop grocery'
			});

			// Fixture mock form input values
			scope.name = 'New Shop grocery';

			// Set POST response
			$httpBackend.expectPOST('shop-groceries', sampleShopGroceryPostData).respond(sampleShopGroceryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Shop grocery was created
			expect($location.path()).toBe('/shop-groceries/' + sampleShopGroceryResponse._id);
		}));

		it('$scope.update() should update a valid Shop grocery', inject(function(ShopGroceries) {
			// Define a sample Shop grocery put data
			var sampleShopGroceryPutData = new ShopGroceries({
				_id: '525cf20451979dea2c000001',
				name: 'New Shop grocery'
			});

			// Mock Shop grocery in scope
			scope.shopGrocery = sampleShopGroceryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/shop-groceries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/shop-groceries/' + sampleShopGroceryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid shopGroceryId and remove the Shop grocery from the scope', inject(function(ShopGroceries) {
			// Create new Shop grocery object
			var sampleShopGrocery = new ShopGroceries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Shop groceries array and include the Shop grocery
			scope.shopGroceries = [sampleShopGrocery];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/shop-groceries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleShopGrocery);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.shopGroceries.length).toBe(0);
		}));
	});
}());