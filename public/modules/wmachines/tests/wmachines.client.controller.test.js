'use strict';

(function() {
	// Wmachines Controller Spec
	describe('Wmachines Controller Tests', function() {
		// Initialize global variables
		var WmachinesController,
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

			// Initialize the Wmachines controller.
			WmachinesController = $controller('WmachinesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Wmachine object fetched from XHR', inject(function(Wmachines) {
			// Create sample Wmachine using the Wmachines service
			var sampleWmachine = new Wmachines({
				name: 'New Wmachine'
			});

			// Create a sample Wmachines array that includes the new Wmachine
			var sampleWmachines = [sampleWmachine];

			// Set GET response
			$httpBackend.expectGET('wmachines').respond(sampleWmachines);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wmachines).toEqualData(sampleWmachines);
		}));

		it('$scope.findOne() should create an array with one Wmachine object fetched from XHR using a wmachineId URL parameter', inject(function(Wmachines) {
			// Define a sample Wmachine object
			var sampleWmachine = new Wmachines({
				name: 'New Wmachine'
			});

			// Set the URL parameter
			$stateParams.wmachineId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/wmachines\/([0-9a-fA-F]{24})$/).respond(sampleWmachine);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wmachine).toEqualData(sampleWmachine);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Wmachines) {
			// Create a sample Wmachine object
			var sampleWmachinePostData = new Wmachines({
				name: 'New Wmachine'
			});

			// Create a sample Wmachine response
			var sampleWmachineResponse = new Wmachines({
				_id: '525cf20451979dea2c000001',
				name: 'New Wmachine'
			});

			// Fixture mock form input values
			scope.name = 'New Wmachine';

			// Set POST response
			$httpBackend.expectPOST('wmachines', sampleWmachinePostData).respond(sampleWmachineResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Wmachine was created
			expect($location.path()).toBe('/wmachines/' + sampleWmachineResponse._id);
		}));

		it('$scope.update() should update a valid Wmachine', inject(function(Wmachines) {
			// Define a sample Wmachine put data
			var sampleWmachinePutData = new Wmachines({
				_id: '525cf20451979dea2c000001',
				name: 'New Wmachine'
			});

			// Mock Wmachine in scope
			scope.wmachine = sampleWmachinePutData;

			// Set PUT response
			$httpBackend.expectPUT(/wmachines\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/wmachines/' + sampleWmachinePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid wmachineId and remove the Wmachine from the scope', inject(function(Wmachines) {
			// Create new Wmachine object
			var sampleWmachine = new Wmachines({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Wmachines array and include the Wmachine
			scope.wmachines = [sampleWmachine];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/wmachines\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWmachine);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.wmachines.length).toBe(0);
		}));
	});
}());