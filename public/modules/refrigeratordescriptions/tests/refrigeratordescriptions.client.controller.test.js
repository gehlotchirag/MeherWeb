'use strict';

(function() {
	// Refrigeratordescriptions Controller Spec
	describe('Refrigeratordescriptions Controller Tests', function() {
		// Initialize global variables
		var RefrigeratordescriptionsController,
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

			// Initialize the Refrigeratordescriptions controller.
			RefrigeratordescriptionsController = $controller('RefrigeratordescriptionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Refrigeratordescription object fetched from XHR', inject(function(Refrigeratordescriptions) {
			// Create sample Refrigeratordescription using the Refrigeratordescriptions service
			var sampleRefrigeratordescription = new Refrigeratordescriptions({
				name: 'New Refrigeratordescription'
			});

			// Create a sample Refrigeratordescriptions array that includes the new Refrigeratordescription
			var sampleRefrigeratordescriptions = [sampleRefrigeratordescription];

			// Set GET response
			$httpBackend.expectGET('refrigeratordescriptions').respond(sampleRefrigeratordescriptions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.refrigeratordescriptions).toEqualData(sampleRefrigeratordescriptions);
		}));

		it('$scope.findOne() should create an array with one Refrigeratordescription object fetched from XHR using a refrigeratordescriptionId URL parameter', inject(function(Refrigeratordescriptions) {
			// Define a sample Refrigeratordescription object
			var sampleRefrigeratordescription = new Refrigeratordescriptions({
				name: 'New Refrigeratordescription'
			});

			// Set the URL parameter
			$stateParams.refrigeratordescriptionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/refrigeratordescriptions\/([0-9a-fA-F]{24})$/).respond(sampleRefrigeratordescription);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.refrigeratordescription).toEqualData(sampleRefrigeratordescription);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Refrigeratordescriptions) {
			// Create a sample Refrigeratordescription object
			var sampleRefrigeratordescriptionPostData = new Refrigeratordescriptions({
				name: 'New Refrigeratordescription'
			});

			// Create a sample Refrigeratordescription response
			var sampleRefrigeratordescriptionResponse = new Refrigeratordescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Refrigeratordescription'
			});

			// Fixture mock form input values
			scope.name = 'New Refrigeratordescription';

			// Set POST response
			$httpBackend.expectPOST('refrigeratordescriptions', sampleRefrigeratordescriptionPostData).respond(sampleRefrigeratordescriptionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Refrigeratordescription was created
			expect($location.path()).toBe('/refrigeratordescriptions/' + sampleRefrigeratordescriptionResponse._id);
		}));

		it('$scope.update() should update a valid Refrigeratordescription', inject(function(Refrigeratordescriptions) {
			// Define a sample Refrigeratordescription put data
			var sampleRefrigeratordescriptionPutData = new Refrigeratordescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Refrigeratordescription'
			});

			// Mock Refrigeratordescription in scope
			scope.refrigeratordescription = sampleRefrigeratordescriptionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/refrigeratordescriptions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/refrigeratordescriptions/' + sampleRefrigeratordescriptionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid refrigeratordescriptionId and remove the Refrigeratordescription from the scope', inject(function(Refrigeratordescriptions) {
			// Create new Refrigeratordescription object
			var sampleRefrigeratordescription = new Refrigeratordescriptions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Refrigeratordescriptions array and include the Refrigeratordescription
			scope.refrigeratordescriptions = [sampleRefrigeratordescription];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/refrigeratordescriptions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRefrigeratordescription);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.refrigeratordescriptions.length).toBe(0);
		}));
	});
}());