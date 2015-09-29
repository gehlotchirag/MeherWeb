'use strict';

(function() {
	// Vegetables Controller Spec
	describe('Vegetables Controller Tests', function() {
		// Initialize global variables
		var VegetablesController,
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

			// Initialize the Vegetables controller.
			VegetablesController = $controller('VegetablesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Vegetable object fetched from XHR', inject(function(Vegetables) {
			// Create sample Vegetable using the Vegetables service
			var sampleVegetable = new Vegetables({
				name: 'New Vegetable'
			});

			// Create a sample Vegetables array that includes the new Vegetable
			var sampleVegetables = [sampleVegetable];

			// Set GET response
			$httpBackend.expectGET('vegetables').respond(sampleVegetables);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vegetables).toEqualData(sampleVegetables);
		}));

		it('$scope.findOne() should create an array with one Vegetable object fetched from XHR using a vegetableId URL parameter', inject(function(Vegetables) {
			// Define a sample Vegetable object
			var sampleVegetable = new Vegetables({
				name: 'New Vegetable'
			});

			// Set the URL parameter
			$stateParams.vegetableId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/vegetables\/([0-9a-fA-F]{24})$/).respond(sampleVegetable);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vegetable).toEqualData(sampleVegetable);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Vegetables) {
			// Create a sample Vegetable object
			var sampleVegetablePostData = new Vegetables({
				name: 'New Vegetable'
			});

			// Create a sample Vegetable response
			var sampleVegetableResponse = new Vegetables({
				_id: '525cf20451979dea2c000001',
				name: 'New Vegetable'
			});

			// Fixture mock form input values
			scope.name = 'New Vegetable';

			// Set POST response
			$httpBackend.expectPOST('vegetables', sampleVegetablePostData).respond(sampleVegetableResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Vegetable was created
			expect($location.path()).toBe('/vegetables/' + sampleVegetableResponse._id);
		}));

		it('$scope.update() should update a valid Vegetable', inject(function(Vegetables) {
			// Define a sample Vegetable put data
			var sampleVegetablePutData = new Vegetables({
				_id: '525cf20451979dea2c000001',
				name: 'New Vegetable'
			});

			// Mock Vegetable in scope
			scope.vegetable = sampleVegetablePutData;

			// Set PUT response
			$httpBackend.expectPUT(/vegetables\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/vegetables/' + sampleVegetablePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid vegetableId and remove the Vegetable from the scope', inject(function(Vegetables) {
			// Create new Vegetable object
			var sampleVegetable = new Vegetables({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Vegetables array and include the Vegetable
			scope.vegetables = [sampleVegetable];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/vegetables\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVegetable);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.vegetables.length).toBe(0);
		}));
	});
}());