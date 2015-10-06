'use strict';

(function() {
	// Acs Controller Spec
	describe('Acs Controller Tests', function() {
		// Initialize global variables
		var AcsController,
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

			// Initialize the Acs controller.
			AcsController = $controller('AcsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ac object fetched from XHR', inject(function(Acs) {
			// Create sample Ac using the Acs service
			var sampleAc = new Acs({
				name: 'New Ac'
			});

			// Create a sample Acs array that includes the new Ac
			var sampleAcs = [sampleAc];

			// Set GET response
			$httpBackend.expectGET('acs').respond(sampleAcs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.acs).toEqualData(sampleAcs);
		}));

		it('$scope.findOne() should create an array with one Ac object fetched from XHR using a acId URL parameter', inject(function(Acs) {
			// Define a sample Ac object
			var sampleAc = new Acs({
				name: 'New Ac'
			});

			// Set the URL parameter
			$stateParams.acId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/acs\/([0-9a-fA-F]{24})$/).respond(sampleAc);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ac).toEqualData(sampleAc);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Acs) {
			// Create a sample Ac object
			var sampleAcPostData = new Acs({
				name: 'New Ac'
			});

			// Create a sample Ac response
			var sampleAcResponse = new Acs({
				_id: '525cf20451979dea2c000001',
				name: 'New Ac'
			});

			// Fixture mock form input values
			scope.name = 'New Ac';

			// Set POST response
			$httpBackend.expectPOST('acs', sampleAcPostData).respond(sampleAcResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ac was created
			expect($location.path()).toBe('/acs/' + sampleAcResponse._id);
		}));

		it('$scope.update() should update a valid Ac', inject(function(Acs) {
			// Define a sample Ac put data
			var sampleAcPutData = new Acs({
				_id: '525cf20451979dea2c000001',
				name: 'New Ac'
			});

			// Mock Ac in scope
			scope.ac = sampleAcPutData;

			// Set PUT response
			$httpBackend.expectPUT(/acs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/acs/' + sampleAcPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid acId and remove the Ac from the scope', inject(function(Acs) {
			// Create new Ac object
			var sampleAc = new Acs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Acs array and include the Ac
			scope.acs = [sampleAc];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/acs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAc);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.acs.length).toBe(0);
		}));
	});
}());