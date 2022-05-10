var app = angular.module("myApp", ["ngRoute"]);

  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
    templateUrl : "contact.html"
    })
    // var
    .when("/red",{
    templateUrl: "red.htm"
    })
  });