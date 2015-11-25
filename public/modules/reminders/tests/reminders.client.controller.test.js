'use strict';

(function() {
	// Reminders Controller Spec
	describe('Reminders Controller Tests', function() {
		// Initialize global variables
		var RemindersController,
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

			// Initialize the Reminders controller.
			RemindersController = $controller('RemindersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Reminder object fetched from XHR', inject(function(Reminders) {
			// Create sample Reminder using the Reminders service
			var sampleReminder = new Reminders({
				name: 'New Reminder'
			});

			// Create a sample Reminders array that includes the new Reminder
			var sampleReminders = [sampleReminder];

			// Set GET response
			$httpBackend.expectGET('reminders').respond(sampleReminders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reminders).toEqualData(sampleReminders);
		}));

		it('$scope.findOne() should create an array with one Reminder object fetched from XHR using a reminderId URL parameter', inject(function(Reminders) {
			// Define a sample Reminder object
			var sampleReminder = new Reminders({
				name: 'New Reminder'
			});

			// Set the URL parameter
			$stateParams.reminderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/reminders\/([0-9a-fA-F]{24})$/).respond(sampleReminder);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reminder).toEqualData(sampleReminder);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Reminders) {
			// Create a sample Reminder object
			var sampleReminderPostData = new Reminders({
				name: 'New Reminder'
			});

			// Create a sample Reminder response
			var sampleReminderResponse = new Reminders({
				_id: '525cf20451979dea2c000001',
				name: 'New Reminder'
			});

			// Fixture mock form input values
			scope.name = 'New Reminder';

			// Set POST response
			$httpBackend.expectPOST('reminders', sampleReminderPostData).respond(sampleReminderResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Reminder was created
			expect($location.path()).toBe('/reminders/' + sampleReminderResponse._id);
		}));

		it('$scope.update() should update a valid Reminder', inject(function(Reminders) {
			// Define a sample Reminder put data
			var sampleReminderPutData = new Reminders({
				_id: '525cf20451979dea2c000001',
				name: 'New Reminder'
			});

			// Mock Reminder in scope
			scope.reminder = sampleReminderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/reminders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/reminders/' + sampleReminderPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid reminderId and remove the Reminder from the scope', inject(function(Reminders) {
			// Create new Reminder object
			var sampleReminder = new Reminders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Reminders array and include the Reminder
			scope.reminders = [sampleReminder];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/reminders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReminder);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.reminders.length).toBe(0);
		}));
	});
}());