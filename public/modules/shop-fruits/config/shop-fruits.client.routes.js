'use strict';

//Setting up route
angular.module('shop-fruits').config(['$stateProvider',
  function($stateProvider) {
    // Shop fruits state routing
    $stateProvider.
        state('listShopFruits', {
          url: '/shop-fruits',
          templateUrl: 'modules/shop-fruits/views/list-shop-fruits.client.view.html'
        }).
        state('listNearShopFruits', {
          url: '/shop-near-fruits',
          templateUrl: 'modules/shop-fruits/views/list-near-shop-fruits.client.view.html'
        }).

        state('createShopFruit', {
          url: '/shop-fruits/create',
          templateUrl: 'modules/shop-fruits/views/create-shop-fruit.client.view.html'
        }).
        state('viewShopFruit', {
          url: '/shop-fruits/:shopFruitId',
          templateUrl: 'modules/shop-fruits/views/view-shop-fruit.client.view.html'
        }).
        state('editShopFruit', {
          url: '/shop-fruits/:shopFruitId/edit',
          templateUrl: 'modules/shop-fruits/views/edit-shop-fruit.client.view.html'
        });
  }
]);
