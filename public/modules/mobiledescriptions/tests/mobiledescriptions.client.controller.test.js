'use strict';

(function() {
	// Mobiledescriptions Controller Spec
	describe('Mobiledescriptions Controller Tests', function() {
		// Initialize global variables
		var MobiledescriptionsController,
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

			// Initialize the Mobiledescriptions controller.
			MobiledescriptionsController = $controller('MobiledescriptionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mobiledescription object fetched from XHR', inject(function(Mobiledescriptions) {
			// Create sample Mobiledescription using the Mobiledescriptions service
			var sampleMobiledescription = new Mobiledescriptions({
				name: 'New Mobiledescription'
			});

			// Create a sample Mobiledescriptions array that includes the new Mobiledescription
			var sampleMobiledescriptions = [sampleMobiledescription];

			// Set GET response
			$httpBackend.expectGET('mobiledescriptions').respond(sampleMobiledescriptions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mobiledescriptions).toEqualData(sampleMobiledescriptions);
		}));

		it('$scope.findOne() should create an array with one Mobiledescription object fetched from XHR using a mobiledescriptionId URL parameter', inject(function(Mobiledescriptions) {
			// Define a sample Mobiledescription object
			var sampleMobiledescription = new Mobiledescriptions({
				name: 'New Mobiledescription'
			});

			// Set the URL parameter
			$stateParams.mobiledescriptionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mobiledescriptions\/([0-9a-fA-F]{24})$/).respond(sampleMobiledescription);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mobiledescription).toEqualData(sampleMobiledescription);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mobiledescriptions) {
			// Create a sample Mobiledescription object
			var sampleMobiledescriptionPostData = new Mobiledescriptions({
				name: 'New Mobiledescription'
			});

			// Create a sample Mobiledescription response
			var sampleMobiledescriptionResponse = new Mobiledescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Mobiledescription'
			});

			// Fixture mock form input values
			scope.name = 'New Mobiledescription';

			// Set POST response
			$httpBackend.expectPOST('mobiledescriptions', sampleMobiledescriptionPostData).respond(sampleMobiledescriptionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mobiledescription was created
			expect($location.path()).toBe('/mobiledescriptions/' + sampleMobiledescriptionResponse._id);
		}));

		it('$scope.update() should update a valid Mobiledescription', inject(function(Mobiledescriptions) {
			// Define a sample Mobiledescription put data
			var sampleMobiledescriptionPutData = new Mobiledescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Mobiledescription'
			});

			// Mock Mobiledescription in scope
			scope.mobiledescription = sampleMobiledescriptionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/mobiledescriptions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mobiledescriptions/' + sampleMobiledescriptionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mobiledescriptionId and remove the Mobiledescription from the scope', inject(function(Mobiledescriptions) {
			// Create new Mobiledescription object
			var sampleMobiledescription = new Mobiledescriptions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mobiledescriptions array and include the Mobiledescription
			scope.mobiledescriptions = [sampleMobiledescription];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mobiledescriptions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMobiledescription);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mobiledescriptions.length).toBe(0);
		}));
	});
}());