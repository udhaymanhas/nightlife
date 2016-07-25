'use strict';

angular.module('nightLife')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/main/view-2.html',
        controller: 'xCtrl2'
      })
        
      .otherwise({redirectTo:'/'});
  });