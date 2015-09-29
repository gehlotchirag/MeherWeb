'use strict';

(function() {
	// Sprouts vegetables Controller Spec
	describe('Sprouts vegetables Controller Tests', function() {
		// Initialize global variables
		var SproutsVegetablesController,
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

			// Initialize the Sprouts vegetables controller.
			SproutsVegetablesController = $controller('SproutsVegetablesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sprouts vegetable object fetched from XHR', inject(function(SproutsVegetables) {
			// Create sample Sprouts vegetable using the Sprouts vegetables service
			var sampleSproutsVegetable = new SproutsVegetables({
				name: 'New Sprouts vegetable'
			});

			// Create a sample Sprouts vegetables array that includes the new Sprouts vegetable
			var sampleSproutsVegetables = [sampleSproutsVegetable];

			// Set GET response
			$httpBackend.expectGET('sprouts-vegetables').respond(sampleSproutsVegetables);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sproutsVegetables).toEqualData(sampleSproutsVegetables);
		}));

		it('$scope.findOne() should create an array with one Sprouts vegetable object fetched from XHR using a sproutsVegetableId URL parameter', inject(function(SproutsVegetables) {
			// Define a sample Sprouts vegetable object
			var sampleSproutsVegetable = new SproutsVegetables({
				name: 'New Sprouts vegetable'
			});

			// Set the URL parameter
			$stateParams.sproutsVegetableId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sprouts-vegetables\/([0-9a-fA-F]{24})$/).respond(sampleSproutsVegetable);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sproutsVegetable).toEqualData(sampleSproutsVegetable);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(SproutsVegetables) {
			// Create a sample Sprouts vegetable object
			var sampleSproutsVegetablePostData = new SproutsVegetables({
				name: 'New Sprouts vegetable'
			});

			// Create a sample Sprouts vegetable response
			var sampleSproutsVegetableResponse = new SproutsVegetables({
				_id: '525cf20451979dea2c000001',
				name: 'New Sprouts vegetable'
			});

			// Fixture mock form input values
			scope.name = 'New Sprouts vegetable';

			// Set POST response
			$httpBackend.expectPOST('sprouts-vegetables', sampleSproutsVegetablePostData).respond(sampleSproutsVegetableResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sprouts vegetable was created
			expect($location.path()).toBe('/sprouts-vegetables/' + sampleSproutsVegetableResponse._id);
		}));

		it('$scope.update() should update a valid Sprouts vegetable', inject(function(SproutsVegetables) {
			// Define a sample Sprouts vegetable put data
			var sampleSproutsVegetablePutData = new SproutsVegetables({
				_id: '525cf20451979dea2c000001',
				name: 'New Sprouts vegetable'
			});

			// Mock Sprouts vegetable in scope
			scope.sproutsVegetable = sampleSproutsVegetablePutData;

			// Set PUT response
			$httpBackend.expectPUT(/sprouts-vegetables\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sprouts-vegetables/' + sampleSproutsVegetablePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sproutsVegetableId and remove the Sprouts vegetable from the scope', inject(function(SproutsVegetables) {
			// Create new Sprouts vegetable object
			var sampleSproutsVegetable = new SproutsVegetables({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sprouts vegetables array and include the Sprouts vegetable
			scope.sproutsVegetables = [sampleSproutsVegetable];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sprouts-vegetables\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSproutsVegetable);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sproutsVegetables.length).toBe(0);
		}));
	});
}());