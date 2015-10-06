'use strict';

(function() {
	// Mobiles Controller Spec
	describe('Mobiles Controller Tests', function() {
		// Initialize global variables
		var MobilesController,
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

			// Initialize the Mobiles controller.
			MobilesController = $controller('MobilesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mobile object fetched from XHR', inject(function(Mobiles) {
			// Create sample Mobile using the Mobiles service
			var sampleMobile = new Mobiles({
				name: 'New Mobile'
			});

			// Create a sample Mobiles array that includes the new Mobile
			var sampleMobiles = [sampleMobile];

			// Set GET response
			$httpBackend.expectGET('mobiles').respond(sampleMobiles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mobiles).toEqualData(sampleMobiles);
		}));

		it('$scope.findOne() should create an array with one Mobile object fetched from XHR using a mobileId URL parameter', inject(function(Mobiles) {
			// Define a sample Mobile object
			var sampleMobile = new Mobiles({
				name: 'New Mobile'
			});

			// Set the URL parameter
			$stateParams.mobileId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mobiles\/([0-9a-fA-F]{24})$/).respond(sampleMobile);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mobile).toEqualData(sampleMobile);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mobiles) {
			// Create a sample Mobile object
			var sampleMobilePostData = new Mobiles({
				name: 'New Mobile'
			});

			// Create a sample Mobile response
			var sampleMobileResponse = new Mobiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Mobile'
			});

			// Fixture mock form input values
			scope.name = 'New Mobile';

			// Set POST response
			$httpBackend.expectPOST('mobiles', sampleMobilePostData).respond(sampleMobileResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mobile was created
			expect($location.path()).toBe('/mobiles/' + sampleMobileResponse._id);
		}));

		it('$scope.update() should update a valid Mobile', inject(function(Mobiles) {
			// Define a sample Mobile put data
			var sampleMobilePutData = new Mobiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Mobile'
			});

			// Mock Mobile in scope
			scope.mobile = sampleMobilePutData;

			// Set PUT response
			$httpBackend.expectPUT(/mobiles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mobiles/' + sampleMobilePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mobileId and remove the Mobile from the scope', inject(function(Mobiles) {
			// Create new Mobile object
			var sampleMobile = new Mobiles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mobiles array and include the Mobile
			scope.mobiles = [sampleMobile];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mobiles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMobile);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mobiles.length).toBe(0);
		}));
	});
}());