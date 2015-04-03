'use strict';

var view404 = angular.module('catiApp.view404', ['ngRoute']);

view404.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/404', {
    templateUrl: 'view404/view404.html',
    controller: 'Ctrl404'
  });
}]);

view404.controller('Ctrl404',[, function(){
  //Страница ошибки 404
}]);