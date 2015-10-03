'use strict';

(function() {
	// Shop medicals Controller Spec
	describe('Shop medicals Controller Tests', function() {
		// Initialize global variables
		var ShopMedicalsController,
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

			// Initialize the Shop medicals controller.
			ShopMedicalsController = $controller('ShopMedicalsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Shop medical object fetched from XHR', inject(function(ShopMedicals) {
			// Create sample Shop medical using the Shop medicals service
			var sampleShopMedical = new ShopMedicals({
				name: 'New Shop medical'
			});

			// Create a sample Shop medicals array that includes the new Shop medical
			var sampleShopMedicals = [sampleShopMedical];

			// Set GET response
			$httpBackend.expectGET('shop-medicals').respond(sampleShopMedicals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shopMedicals).toEqualData(sampleShopMedicals);
		}));

		it('$scope.findOne() should create an array with one Shop medical object fetched from XHR using a shopMedicalId URL parameter', inject(function(ShopMedicals) {
			// Define a sample Shop medical object
			var sampleShopMedical = new ShopMedicals({
				name: 'New Shop medical'
			});

			// Set the URL parameter
			$stateParams.shopMedicalId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/shop-medicals\/([0-9a-fA-F]{24})$/).respond(sampleShopMedical);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shopMedical).toEqualData(sampleShopMedical);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ShopMedicals) {
			// Create a sample Shop medical object
			var sampleShopMedicalPostData = new ShopMedicals({
				name: 'New Shop medical'
			});

			// Create a sample Shop medical response
			var sampleShopMedicalResponse = new ShopMedicals({
				_id: '525cf20451979dea2c000001',
				name: 'New Shop medical'
			});

			// Fixture mock form input values
			scope.name = 'New Shop medical';

			// Set POST response
			$httpBackend.expectPOST('shop-medicals', sampleShopMedicalPostData).respond(sampleShopMedicalResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Shop medical was created
			expect($location.path()).toBe('/shop-medicals/' + sampleShopMedicalResponse._id);
		}));

		it('$scope.update() should update a valid Shop medical', inject(function(ShopMedicals) {
			// Define a sample Shop medical put data
			var sampleShopMedicalPutData = new ShopMedicals({
				_id: '525cf20451979dea2c000001',
				name: 'New Shop medical'
			});

			// Mock Shop medical in scope
			scope.shopMedical = sampleShopMedicalPutData;

			// Set PUT response
			$httpBackend.expectPUT(/shop-medicals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/shop-medicals/' + sampleShopMedicalPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid shopMedicalId and remove the Shop medical from the scope', inject(function(ShopMedicals) {
			// Create new Shop medical object
			var sampleShopMedical = new ShopMedicals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Shop medicals array and include the Shop medical
			scope.shopMedicals = [sampleShopMedical];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/shop-medicals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleShopMedical);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.shopMedicals.length).toBe(0);
		}));
	});
}());