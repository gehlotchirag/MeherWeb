'use strict';

(function() {
	// Categorylists Controller Spec
	describe('Categorylists Controller Tests', function() {
		// Initialize global variables
		var CategorylistsController,
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

			// Initialize the Categorylists controller.
			CategorylistsController = $controller('CategorylistsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Categorylist object fetched from XHR', inject(function(Categorylists) {
			// Create sample Categorylist using the Categorylists service
			var sampleCategorylist = new Categorylists({
				name: 'New Categorylist'
			});

			// Create a sample Categorylists array that includes the new Categorylist
			var sampleCategorylists = [sampleCategorylist];

			// Set GET response
			$httpBackend.expectGET('categorylists').respond(sampleCategorylists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categorylists).toEqualData(sampleCategorylists);
		}));

		it('$scope.findOne() should create an array with one Categorylist object fetched from XHR using a categorylistId URL parameter', inject(function(Categorylists) {
			// Define a sample Categorylist object
			var sampleCategorylist = new Categorylists({
				name: 'New Categorylist'
			});

			// Set the URL parameter
			$stateParams.categorylistId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/categorylists\/([0-9a-fA-F]{24})$/).respond(sampleCategorylist);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categorylist).toEqualData(sampleCategorylist);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Categorylists) {
			// Create a sample Categorylist object
			var sampleCategorylistPostData = new Categorylists({
				name: 'New Categorylist'
			});

			// Create a sample Categorylist response
			var sampleCategorylistResponse = new Categorylists({
				_id: '525cf20451979dea2c000001',
				name: 'New Categorylist'
			});

			// Fixture mock form input values
			scope.name = 'New Categorylist';

			// Set POST response
			$httpBackend.expectPOST('categorylists', sampleCategorylistPostData).respond(sampleCategorylistResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Categorylist was created
			expect($location.path()).toBe('/categorylists/' + sampleCategorylistResponse._id);
		}));

		it('$scope.update() should update a valid Categorylist', inject(function(Categorylists) {
			// Define a sample Categorylist put data
			var sampleCategorylistPutData = new Categorylists({
				_id: '525cf20451979dea2c000001',
				name: 'New Categorylist'
			});

			// Mock Categorylist in scope
			scope.categorylist = sampleCategorylistPutData;

			// Set PUT response
			$httpBackend.expectPUT(/categorylists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/categorylists/' + sampleCategorylistPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid categorylistId and remove the Categorylist from the scope', inject(function(Categorylists) {
			// Create new Categorylist object
			var sampleCategorylist = new Categorylists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Categorylists array and include the Categorylist
			scope.categorylists = [sampleCategorylist];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/categorylists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCategorylist);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.categorylists.length).toBe(0);
		}));
	});
}());