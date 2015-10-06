'use strict';

(function() {
	// Wmachinedescriptions Controller Spec
	describe('Wmachinedescriptions Controller Tests', function() {
		// Initialize global variables
		var WmachinedescriptionsController,
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

			// Initialize the Wmachinedescriptions controller.
			WmachinedescriptionsController = $controller('WmachinedescriptionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Wmachinedescription object fetched from XHR', inject(function(Wmachinedescriptions) {
			// Create sample Wmachinedescription using the Wmachinedescriptions service
			var sampleWmachinedescription = new Wmachinedescriptions({
				name: 'New Wmachinedescription'
			});

			// Create a sample Wmachinedescriptions array that includes the new Wmachinedescription
			var sampleWmachinedescriptions = [sampleWmachinedescription];

			// Set GET response
			$httpBackend.expectGET('wmachinedescriptions').respond(sampleWmachinedescriptions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wmachinedescriptions).toEqualData(sampleWmachinedescriptions);
		}));

		it('$scope.findOne() should create an array with one Wmachinedescription object fetched from XHR using a wmachinedescriptionId URL parameter', inject(function(Wmachinedescriptions) {
			// Define a sample Wmachinedescription object
			var sampleWmachinedescription = new Wmachinedescriptions({
				name: 'New Wmachinedescription'
			});

			// Set the URL parameter
			$stateParams.wmachinedescriptionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/wmachinedescriptions\/([0-9a-fA-F]{24})$/).respond(sampleWmachinedescription);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wmachinedescription).toEqualData(sampleWmachinedescription);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Wmachinedescriptions) {
			// Create a sample Wmachinedescription object
			var sampleWmachinedescriptionPostData = new Wmachinedescriptions({
				name: 'New Wmachinedescription'
			});

			// Create a sample Wmachinedescription response
			var sampleWmachinedescriptionResponse = new Wmachinedescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Wmachinedescription'
			});

			// Fixture mock form input values
			scope.name = 'New Wmachinedescription';

			// Set POST response
			$httpBackend.expectPOST('wmachinedescriptions', sampleWmachinedescriptionPostData).respond(sampleWmachinedescriptionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Wmachinedescription was created
			expect($location.path()).toBe('/wmachinedescriptions/' + sampleWmachinedescriptionResponse._id);
		}));

		it('$scope.update() should update a valid Wmachinedescription', inject(function(Wmachinedescriptions) {
			// Define a sample Wmachinedescription put data
			var sampleWmachinedescriptionPutData = new Wmachinedescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Wmachinedescription'
			});

			// Mock Wmachinedescription in scope
			scope.wmachinedescription = sampleWmachinedescriptionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/wmachinedescriptions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/wmachinedescriptions/' + sampleWmachinedescriptionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid wmachinedescriptionId and remove the Wmachinedescription from the scope', inject(function(Wmachinedescriptions) {
			// Create new Wmachinedescription object
			var sampleWmachinedescription = new Wmachinedescriptions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Wmachinedescriptions array and include the Wmachinedescription
			scope.wmachinedescriptions = [sampleWmachinedescription];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/wmachinedescriptions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWmachinedescription);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.wmachinedescriptions.length).toBe(0);
		}));
	});
}());