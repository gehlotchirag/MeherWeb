'use strict';

(function() {
	// Acdescriptions Controller Spec
	describe('Acdescriptions Controller Tests', function() {
		// Initialize global variables
		var AcdescriptionsController,
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

			// Initialize the Acdescriptions controller.
			AcdescriptionsController = $controller('AcdescriptionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Acdescription object fetched from XHR', inject(function(Acdescriptions) {
			// Create sample Acdescription using the Acdescriptions service
			var sampleAcdescription = new Acdescriptions({
				name: 'New Acdescription'
			});

			// Create a sample Acdescriptions array that includes the new Acdescription
			var sampleAcdescriptions = [sampleAcdescription];

			// Set GET response
			$httpBackend.expectGET('acdescriptions').respond(sampleAcdescriptions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.acdescriptions).toEqualData(sampleAcdescriptions);
		}));

		it('$scope.findOne() should create an array with one Acdescription object fetched from XHR using a acdescriptionId URL parameter', inject(function(Acdescriptions) {
			// Define a sample Acdescription object
			var sampleAcdescription = new Acdescriptions({
				name: 'New Acdescription'
			});

			// Set the URL parameter
			$stateParams.acdescriptionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/acdescriptions\/([0-9a-fA-F]{24})$/).respond(sampleAcdescription);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.acdescription).toEqualData(sampleAcdescription);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Acdescriptions) {
			// Create a sample Acdescription object
			var sampleAcdescriptionPostData = new Acdescriptions({
				name: 'New Acdescription'
			});

			// Create a sample Acdescription response
			var sampleAcdescriptionResponse = new Acdescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Acdescription'
			});

			// Fixture mock form input values
			scope.name = 'New Acdescription';

			// Set POST response
			$httpBackend.expectPOST('acdescriptions', sampleAcdescriptionPostData).respond(sampleAcdescriptionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Acdescription was created
			expect($location.path()).toBe('/acdescriptions/' + sampleAcdescriptionResponse._id);
		}));

		it('$scope.update() should update a valid Acdescription', inject(function(Acdescriptions) {
			// Define a sample Acdescription put data
			var sampleAcdescriptionPutData = new Acdescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Acdescription'
			});

			// Mock Acdescription in scope
			scope.acdescription = sampleAcdescriptionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/acdescriptions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/acdescriptions/' + sampleAcdescriptionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid acdescriptionId and remove the Acdescription from the scope', inject(function(Acdescriptions) {
			// Create new Acdescription object
			var sampleAcdescription = new Acdescriptions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Acdescriptions array and include the Acdescription
			scope.acdescriptions = [sampleAcdescription];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/acdescriptions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAcdescription);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.acdescriptions.length).toBe(0);
		}));
	});
}());