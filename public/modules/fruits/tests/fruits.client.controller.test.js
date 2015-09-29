'use strict';

(function() {
	// Fruits Controller Spec
	describe('Fruits Controller Tests', function() {
		// Initialize global variables
		var FruitsController,
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

			// Initialize the Fruits controller.
			FruitsController = $controller('FruitsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Fruit object fetched from XHR', inject(function(Fruits) {
			// Create sample Fruit using the Fruits service
			var sampleFruit = new Fruits({
				name: 'New Fruit'
			});

			// Create a sample Fruits array that includes the new Fruit
			var sampleFruits = [sampleFruit];

			// Set GET response
			$httpBackend.expectGET('fruits').respond(sampleFruits);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fruits).toEqualData(sampleFruits);
		}));

		it('$scope.findOne() should create an array with one Fruit object fetched from XHR using a fruitId URL parameter', inject(function(Fruits) {
			// Define a sample Fruit object
			var sampleFruit = new Fruits({
				name: 'New Fruit'
			});

			// Set the URL parameter
			$stateParams.fruitId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/fruits\/([0-9a-fA-F]{24})$/).respond(sampleFruit);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fruit).toEqualData(sampleFruit);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Fruits) {
			// Create a sample Fruit object
			var sampleFruitPostData = new Fruits({
				name: 'New Fruit'
			});

			// Create a sample Fruit response
			var sampleFruitResponse = new Fruits({
				_id: '525cf20451979dea2c000001',
				name: 'New Fruit'
			});

			// Fixture mock form input values
			scope.name = 'New Fruit';

			// Set POST response
			$httpBackend.expectPOST('fruits', sampleFruitPostData).respond(sampleFruitResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Fruit was created
			expect($location.path()).toBe('/fruits/' + sampleFruitResponse._id);
		}));

		it('$scope.update() should update a valid Fruit', inject(function(Fruits) {
			// Define a sample Fruit put data
			var sampleFruitPutData = new Fruits({
				_id: '525cf20451979dea2c000001',
				name: 'New Fruit'
			});

			// Mock Fruit in scope
			scope.fruit = sampleFruitPutData;

			// Set PUT response
			$httpBackend.expectPUT(/fruits\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/fruits/' + sampleFruitPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid fruitId and remove the Fruit from the scope', inject(function(Fruits) {
			// Create new Fruit object
			var sampleFruit = new Fruits({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Fruits array and include the Fruit
			scope.fruits = [sampleFruit];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/fruits\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFruit);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.fruits.length).toBe(0);
		}));
	});
}());