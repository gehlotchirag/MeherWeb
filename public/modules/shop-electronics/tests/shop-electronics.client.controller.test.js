'use strict';

(function() {
	// Shop electronics Controller Spec
	describe('Shop electronics Controller Tests', function() {
		// Initialize global variables
		var ShopElectronicsController,
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

			// Initialize the Shop electronics controller.
			ShopElectronicsController = $controller('ShopElectronicsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Shop electronic object fetched from XHR', inject(function(ShopElectronics) {
			// Create sample Shop electronic using the Shop electronics service
			var sampleShopElectronic = new ShopElectronics({
				name: 'New Shop electronic'
			});

			// Create a sample Shop electronics array that includes the new Shop electronic
			var sampleShopElectronics = [sampleShopElectronic];

			// Set GET response
			$httpBackend.expectGET('shop-electronics').respond(sampleShopElectronics);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shopElectronics).toEqualData(sampleShopElectronics);
		}));

		it('$scope.findOne() should create an array with one Shop electronic object fetched from XHR using a shopElectronicId URL parameter', inject(function(ShopElectronics) {
			// Define a sample Shop electronic object
			var sampleShopElectronic = new ShopElectronics({
				name: 'New Shop electronic'
			});

			// Set the URL parameter
			$stateParams.shopElectronicId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/shop-electronics\/([0-9a-fA-F]{24})$/).respond(sampleShopElectronic);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shopElectronic).toEqualData(sampleShopElectronic);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ShopElectronics) {
			// Create a sample Shop electronic object
			var sampleShopElectronicPostData = new ShopElectronics({
				name: 'New Shop electronic'
			});

			// Create a sample Shop electronic response
			var sampleShopElectronicResponse = new ShopElectronics({
				_id: '525cf20451979dea2c000001',
				name: 'New Shop electronic'
			});

			// Fixture mock form input values
			scope.name = 'New Shop electronic';

			// Set POST response
			$httpBackend.expectPOST('shop-electronics', sampleShopElectronicPostData).respond(sampleShopElectronicResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Shop electronic was created
			expect($location.path()).toBe('/shop-electronics/' + sampleShopElectronicResponse._id);
		}));

		it('$scope.update() should update a valid Shop electronic', inject(function(ShopElectronics) {
			// Define a sample Shop electronic put data
			var sampleShopElectronicPutData = new ShopElectronics({
				_id: '525cf20451979dea2c000001',
				name: 'New Shop electronic'
			});

			// Mock Shop electronic in scope
			scope.shopElectronic = sampleShopElectronicPutData;

			// Set PUT response
			$httpBackend.expectPUT(/shop-electronics\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/shop-electronics/' + sampleShopElectronicPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid shopElectronicId and remove the Shop electronic from the scope', inject(function(ShopElectronics) {
			// Create new Shop electronic object
			var sampleShopElectronic = new ShopElectronics({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Shop electronics array and include the Shop electronic
			scope.shopElectronics = [sampleShopElectronic];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/shop-electronics\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleShopElectronic);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.shopElectronics.length).toBe(0);
		}));
	});
}());