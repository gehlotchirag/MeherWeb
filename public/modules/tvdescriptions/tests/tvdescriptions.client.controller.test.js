'use strict';

(function() {
	// Tvdescriptions Controller Spec
	describe('Tvdescriptions Controller Tests', function() {
		// Initialize global variables
		var TvdescriptionsController,
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

			// Initialize the Tvdescriptions controller.
			TvdescriptionsController = $controller('TvdescriptionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tvdescription object fetched from XHR', inject(function(Tvdescriptions) {
			// Create sample Tvdescription using the Tvdescriptions service
			var sampleTvdescription = new Tvdescriptions({
				name: 'New Tvdescription'
			});

			// Create a sample Tvdescriptions array that includes the new Tvdescription
			var sampleTvdescriptions = [sampleTvdescription];

			// Set GET response
			$httpBackend.expectGET('tvdescriptions').respond(sampleTvdescriptions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tvdescriptions).toEqualData(sampleTvdescriptions);
		}));

		it('$scope.findOne() should create an array with one Tvdescription object fetched from XHR using a tvdescriptionId URL parameter', inject(function(Tvdescriptions) {
			// Define a sample Tvdescription object
			var sampleTvdescription = new Tvdescriptions({
				name: 'New Tvdescription'
			});

			// Set the URL parameter
			$stateParams.tvdescriptionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tvdescriptions\/([0-9a-fA-F]{24})$/).respond(sampleTvdescription);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tvdescription).toEqualData(sampleTvdescription);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tvdescriptions) {
			// Create a sample Tvdescription object
			var sampleTvdescriptionPostData = new Tvdescriptions({
				name: 'New Tvdescription'
			});

			// Create a sample Tvdescription response
			var sampleTvdescriptionResponse = new Tvdescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Tvdescription'
			});

			// Fixture mock form input values
			scope.name = 'New Tvdescription';

			// Set POST response
			$httpBackend.expectPOST('tvdescriptions', sampleTvdescriptionPostData).respond(sampleTvdescriptionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tvdescription was created
			expect($location.path()).toBe('/tvdescriptions/' + sampleTvdescriptionResponse._id);
		}));

		it('$scope.update() should update a valid Tvdescription', inject(function(Tvdescriptions) {
			// Define a sample Tvdescription put data
			var sampleTvdescriptionPutData = new Tvdescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Tvdescription'
			});

			// Mock Tvdescription in scope
			scope.tvdescription = sampleTvdescriptionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tvdescriptions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tvdescriptions/' + sampleTvdescriptionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tvdescriptionId and remove the Tvdescription from the scope', inject(function(Tvdescriptions) {
			// Create new Tvdescription object
			var sampleTvdescription = new Tvdescriptions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tvdescriptions array and include the Tvdescription
			scope.tvdescriptions = [sampleTvdescription];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tvdescriptions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTvdescription);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tvdescriptions.length).toBe(0);
		}));
	});
}());