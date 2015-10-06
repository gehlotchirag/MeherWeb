'use strict';

(function() {
	// Tvs Controller Spec
	describe('Tvs Controller Tests', function() {
		// Initialize global variables
		var TvsController,
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

			// Initialize the Tvs controller.
			TvsController = $controller('TvsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tv object fetched from XHR', inject(function(Tvs) {
			// Create sample Tv using the Tvs service
			var sampleTv = new Tvs({
				name: 'New Tv'
			});

			// Create a sample Tvs array that includes the new Tv
			var sampleTvs = [sampleTv];

			// Set GET response
			$httpBackend.expectGET('tvs').respond(sampleTvs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tvs).toEqualData(sampleTvs);
		}));

		it('$scope.findOne() should create an array with one Tv object fetched from XHR using a tvId URL parameter', inject(function(Tvs) {
			// Define a sample Tv object
			var sampleTv = new Tvs({
				name: 'New Tv'
			});

			// Set the URL parameter
			$stateParams.tvId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tvs\/([0-9a-fA-F]{24})$/).respond(sampleTv);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tv).toEqualData(sampleTv);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tvs) {
			// Create a sample Tv object
			var sampleTvPostData = new Tvs({
				name: 'New Tv'
			});

			// Create a sample Tv response
			var sampleTvResponse = new Tvs({
				_id: '525cf20451979dea2c000001',
				name: 'New Tv'
			});

			// Fixture mock form input values
			scope.name = 'New Tv';

			// Set POST response
			$httpBackend.expectPOST('tvs', sampleTvPostData).respond(sampleTvResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tv was created
			expect($location.path()).toBe('/tvs/' + sampleTvResponse._id);
		}));

		it('$scope.update() should update a valid Tv', inject(function(Tvs) {
			// Define a sample Tv put data
			var sampleTvPutData = new Tvs({
				_id: '525cf20451979dea2c000001',
				name: 'New Tv'
			});

			// Mock Tv in scope
			scope.tv = sampleTvPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tvs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tvs/' + sampleTvPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tvId and remove the Tv from the scope', inject(function(Tvs) {
			// Create new Tv object
			var sampleTv = new Tvs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tvs array and include the Tv
			scope.tvs = [sampleTv];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tvs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTv);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tvs.length).toBe(0);
		}));
	});
}());