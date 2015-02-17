'use strict';

/**
 * @ngdoc overview
 * @name hyenaTimeclocksApp
 * @description
 * # hyenaTimeclocksApp
 *
 * Main module of the application.
 */
angular
  .module('hyenaTimeclocksApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularMoment',
    'hyenaAngular',
    'ngTagsInput',
    'ngStorage'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/:groupId', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/:groupId/timeclock/new', {
        templateUrl: 'views/new.html',
        controller: 'NewCtrl'
      })
      .when('/:groupId/timeclock/:timeclockId', {
        templateUrl: 'views/timeclock.html',
        controller: 'TimeclockCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  })
  .constant('FBURL', 'https://hyena-timeclocks.firebaseio.com/')
  .constant('APIKEY', 'OWMyOGU3ZjQ1MTVjYmNkNGQ3NDlmY2Iz')
  .constant('APIPATH', 'http://st-studio.unl.edu/hyena_platform/public/api/1.0/')
  .constant('PLATFORM_ROOT', 'http://st-studio.unl.edu/hyena_platform/public/')
  .constant('AUTH_SCOPE', 'groups');
