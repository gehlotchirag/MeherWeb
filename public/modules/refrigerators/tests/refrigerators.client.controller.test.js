'use strict';

(function() {
	// Refrigerators Controller Spec
	describe('Refrigerators Controller Tests', function() {
		// Initialize global variables
		var RefrigeratorsController,
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

			// Initialize the Refrigerators controller.
			RefrigeratorsController = $controller('RefrigeratorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Refrigerator object fetched from XHR', inject(function(Refrigerators) {
			// Create sample Refrigerator using the Refrigerators service
			var sampleRefrigerator = new Refrigerators({
				name: 'New Refrigerator'
			});

			// Create a sample Refrigerators array that includes the new Refrigerator
			var sampleRefrigerators = [sampleRefrigerator];

			// Set GET response
			$httpBackend.expectGET('refrigerators').respond(sampleRefrigerators);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.refrigerators).toEqualData(sampleRefrigerators);
		}));

		it('$scope.findOne() should create an array with one Refrigerator object fetched from XHR using a refrigeratorId URL parameter', inject(function(Refrigerators) {
			// Define a sample Refrigerator object
			var sampleRefrigerator = new Refrigerators({
				name: 'New Refrigerator'
			});

			// Set the URL parameter
			$stateParams.refrigeratorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/refrigerators\/([0-9a-fA-F]{24})$/).respond(sampleRefrigerator);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.refrigerator).toEqualData(sampleRefrigerator);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Refrigerators) {
			// Create a sample Refrigerator object
			var sampleRefrigeratorPostData = new Refrigerators({
				name: 'New Refrigerator'
			});

			// Create a sample Refrigerator response
			var sampleRefrigeratorResponse = new Refrigerators({
				_id: '525cf20451979dea2c000001',
				name: 'New Refrigerator'
			});

			// Fixture mock form input values
			scope.name = 'New Refrigerator';

			// Set POST response
			$httpBackend.expectPOST('refrigerators', sampleRefrigeratorPostData).respond(sampleRefrigeratorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Refrigerator was created
			expect($location.path()).toBe('/refrigerators/' + sampleRefrigeratorResponse._id);
		}));

		it('$scope.update() should update a valid Refrigerator', inject(function(Refrigerators) {
			// Define a sample Refrigerator put data
			var sampleRefrigeratorPutData = new Refrigerators({
				_id: '525cf20451979dea2c000001',
				name: 'New Refrigerator'
			});

			// Mock Refrigerator in scope
			scope.refrigerator = sampleRefrigeratorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/refrigerators\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/refrigerators/' + sampleRefrigeratorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid refrigeratorId and remove the Refrigerator from the scope', inject(function(Refrigerators) {
			// Create new Refrigerator object
			var sampleRefrigerator = new Refrigerators({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Refrigerators array and include the Refrigerator
			scope.refrigerators = [sampleRefrigerator];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/refrigerators\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRefrigerator);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.refrigerators.length).toBe(0);
		}));
	});
}());