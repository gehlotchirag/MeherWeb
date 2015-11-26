'use strict';

(function() {
	// Calldetails Controller Spec
	describe('Calldetails Controller Tests', function() {
		// Initialize global variables
		var CalldetailsController,
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

			// Initialize the Calldetails controller.
			CalldetailsController = $controller('CalldetailsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Calldetail object fetched from XHR', inject(function(Calldetails) {
			// Create sample Calldetail using the Calldetails service
			var sampleCalldetail = new Calldetails({
				name: 'New Calldetail'
			});

			// Create a sample Calldetails array that includes the new Calldetail
			var sampleCalldetails = [sampleCalldetail];

			// Set GET response
			$httpBackend.expectGET('calldetails').respond(sampleCalldetails);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calldetails).toEqualData(sampleCalldetails);
		}));

		it('$scope.findOne() should create an array with one Calldetail object fetched from XHR using a calldetailId URL parameter', inject(function(Calldetails) {
			// Define a sample Calldetail object
			var sampleCalldetail = new Calldetails({
				name: 'New Calldetail'
			});

			// Set the URL parameter
			$stateParams.calldetailId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/calldetails\/([0-9a-fA-F]{24})$/).respond(sampleCalldetail);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calldetail).toEqualData(sampleCalldetail);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Calldetails) {
			// Create a sample Calldetail object
			var sampleCalldetailPostData = new Calldetails({
				name: 'New Calldetail'
			});

			// Create a sample Calldetail response
			var sampleCalldetailResponse = new Calldetails({
				_id: '525cf20451979dea2c000001',
				name: 'New Calldetail'
			});

			// Fixture mock form input values
			scope.name = 'New Calldetail';

			// Set POST response
			$httpBackend.expectPOST('calldetails', sampleCalldetailPostData).respond(sampleCalldetailResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Calldetail was created
			expect($location.path()).toBe('/calldetails/' + sampleCalldetailResponse._id);
		}));

		it('$scope.update() should update a valid Calldetail', inject(function(Calldetails) {
			// Define a sample Calldetail put data
			var sampleCalldetailPutData = new Calldetails({
				_id: '525cf20451979dea2c000001',
				name: 'New Calldetail'
			});

			// Mock Calldetail in scope
			scope.calldetail = sampleCalldetailPutData;

			// Set PUT response
			$httpBackend.expectPUT(/calldetails\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/calldetails/' + sampleCalldetailPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid calldetailId and remove the Calldetail from the scope', inject(function(Calldetails) {
			// Create new Calldetail object
			var sampleCalldetail = new Calldetails({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Calldetails array and include the Calldetail
			scope.calldetails = [sampleCalldetail];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/calldetails\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCalldetail);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.calldetails.length).toBe(0);
		}));
	});
}());