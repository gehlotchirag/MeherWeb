'use strict';

//Setting up route
angular.module('shop-groceries').config(['$stateProvider',
  function($stateProvider) {
    // Shop groceries state routing
    $stateProvider.
    state('listShopGroceries', {
      url: '/shop-groceries',
      templateUrl: 'modules/shop-groceries/views/list-shop-groceries.client.view.html'
    }).
    state('listNearShopGroceries', {
      url: '/shop-near-groceries',
      templateUrl: 'modules/shop-groceries/views/list-near-shop-groceries.client.view.html'
    }).
    state('createShopGrocery', {
      url: '/shop-groceries/create',
      templateUrl: 'modules/shop-groceries/views/create-shop-grocery.client.view.html'
    }).
    state('viewShopGrocery', {
      url: '/shop-groceries/:shopGroceryId',
      templateUrl: 'modules/shop-groceries/views/view-shop-grocery.client.view.html'
    }).

    state('editfromReminderShopGrocery', {
      url: '/shop-near-groceries/:shopGroceryId/edit',
      templateUrl: 'modules/shop-groceries/views/edit-shop-grocery.client.view.html'
    }).

    state('editShopGrocery', {
      url: '/shop-groceries/:shopGroceryId/edit',
      templateUrl: 'modules/shop-groceries/views/edit-shop-grocery.client.view.html'
    });
  }
]);
