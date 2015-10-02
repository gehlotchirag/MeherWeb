'use strict';

(function() {
	// Packetfoods Controller Spec
	describe('Packetfoods Controller Tests', function() {
		// Initialize global variables
		var PacketfoodsController,
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

			// Initialize the Packetfoods controller.
			PacketfoodsController = $controller('PacketfoodsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Packetfood object fetched from XHR', inject(function(Packetfoods) {
			// Create sample Packetfood using the Packetfoods service
			var samplePacketfood = new Packetfoods({
				name: 'New Packetfood'
			});

			// Create a sample Packetfoods array that includes the new Packetfood
			var samplePacketfoods = [samplePacketfood];

			// Set GET response
			$httpBackend.expectGET('packetfoods').respond(samplePacketfoods);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.packetfoods).toEqualData(samplePacketfoods);
		}));

		it('$scope.findOne() should create an array with one Packetfood object fetched from XHR using a packetfoodId URL parameter', inject(function(Packetfoods) {
			// Define a sample Packetfood object
			var samplePacketfood = new Packetfoods({
				name: 'New Packetfood'
			});

			// Set the URL parameter
			$stateParams.packetfoodId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/packetfoods\/([0-9a-fA-F]{24})$/).respond(samplePacketfood);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.packetfood).toEqualData(samplePacketfood);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Packetfoods) {
			// Create a sample Packetfood object
			var samplePacketfoodPostData = new Packetfoods({
				name: 'New Packetfood'
			});

			// Create a sample Packetfood response
			var samplePacketfoodResponse = new Packetfoods({
				_id: '525cf20451979dea2c000001',
				name: 'New Packetfood'
			});

			// Fixture mock form input values
			scope.name = 'New Packetfood';

			// Set POST response
			$httpBackend.expectPOST('packetfoods', samplePacketfoodPostData).respond(samplePacketfoodResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Packetfood was created
			expect($location.path()).toBe('/packetfoods/' + samplePacketfoodResponse._id);
		}));

		it('$scope.update() should update a valid Packetfood', inject(function(Packetfoods) {
			// Define a sample Packetfood put data
			var samplePacketfoodPutData = new Packetfoods({
				_id: '525cf20451979dea2c000001',
				name: 'New Packetfood'
			});

			// Mock Packetfood in scope
			scope.packetfood = samplePacketfoodPutData;

			// Set PUT response
			$httpBackend.expectPUT(/packetfoods\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/packetfoods/' + samplePacketfoodPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid packetfoodId and remove the Packetfood from the scope', inject(function(Packetfoods) {
			// Create new Packetfood object
			var samplePacketfood = new Packetfoods({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Packetfoods array and include the Packetfood
			scope.packetfoods = [samplePacketfood];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/packetfoods\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePacketfood);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.packetfoods.length).toBe(0);
		}));
	});
}());