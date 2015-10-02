'use strict';

(function() {
	// Personalcares Controller Spec
	describe('Personalcares Controller Tests', function() {
		// Initialize global variables
		var PersonalcaresController,
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

			// Initialize the Personalcares controller.
			PersonalcaresController = $controller('PersonalcaresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Personalcare object fetched from XHR', inject(function(Personalcares) {
			// Create sample Personalcare using the Personalcares service
			var samplePersonalcare = new Personalcares({
				name: 'New Personalcare'
			});

			// Create a sample Personalcares array that includes the new Personalcare
			var samplePersonalcares = [samplePersonalcare];

			// Set GET response
			$httpBackend.expectGET('personalcares').respond(samplePersonalcares);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.personalcares).toEqualData(samplePersonalcares);
		}));

		it('$scope.findOne() should create an array with one Personalcare object fetched from XHR using a personalcareId URL parameter', inject(function(Personalcares) {
			// Define a sample Personalcare object
			var samplePersonalcare = new Personalcares({
				name: 'New Personalcare'
			});

			// Set the URL parameter
			$stateParams.personalcareId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/personalcares\/([0-9a-fA-F]{24})$/).respond(samplePersonalcare);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.personalcare).toEqualData(samplePersonalcare);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Personalcares) {
			// Create a sample Personalcare object
			var samplePersonalcarePostData = new Personalcares({
				name: 'New Personalcare'
			});

			// Create a sample Personalcare response
			var samplePersonalcareResponse = new Personalcares({
				_id: '525cf20451979dea2c000001',
				name: 'New Personalcare'
			});

			// Fixture mock form input values
			scope.name = 'New Personalcare';

			// Set POST response
			$httpBackend.expectPOST('personalcares', samplePersonalcarePostData).respond(samplePersonalcareResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Personalcare was created
			expect($location.path()).toBe('/personalcares/' + samplePersonalcareResponse._id);
		}));

		it('$scope.update() should update a valid Personalcare', inject(function(Personalcares) {
			// Define a sample Personalcare put data
			var samplePersonalcarePutData = new Personalcares({
				_id: '525cf20451979dea2c000001',
				name: 'New Personalcare'
			});

			// Mock Personalcare in scope
			scope.personalcare = samplePersonalcarePutData;

			// Set PUT response
			$httpBackend.expectPUT(/personalcares\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/personalcares/' + samplePersonalcarePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid personalcareId and remove the Personalcare from the scope', inject(function(Personalcares) {
			// Create new Personalcare object
			var samplePersonalcare = new Personalcares({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Personalcares array and include the Personalcare
			scope.personalcares = [samplePersonalcare];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/personalcares\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePersonalcare);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.personalcares.length).toBe(0);
		}));
	});
}());