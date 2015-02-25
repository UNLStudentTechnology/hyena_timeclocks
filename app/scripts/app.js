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
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'angularMoment',
    'hyenaAngular',
    'ngTagsInput',
    'ngStorage'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      //Layouts
      .state('unl-layout', {
        templateUrl: 'views/layouts/unl-layout.html',
        data: {
          requireAuth: true
        }
      })
      .state('unl-layout-kiosk', {
        templateUrl: 'views/layouts/unl-layout-kiosk.html'
      })
      //Views
      .state('unl-layout.timeclocks', {
        url: '/:groupId',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('unl-layout.timeclock_new', {
        url: '/:groupId/timeclock/new',
        templateUrl: 'views/new.html',
        controller: 'NewCtrl'
      })
      .state('unl-layout.timeclock_settings', {
        url: '/:groupId/timeclock/:timeclockId/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .state('unl-layout.timeclock_view', {
        url: '/:groupId/timeclock/:timeclockId',
        templateUrl: 'views/timeclock.html',
        controller: 'TimeclockCtrl'
      })
      .state('unl-layout-kiosk.timeclock_kiosk', {
        url: '/:groupId/timeclock/:timeclockId/kiosk',
        templateUrl: 'views/timeclock_kiosk.html',
        controller: 'TimeclockCtrl'
      });
      //Default Route
      $urlRouterProvider.otherwise("/");
      //End Default Route
      
      //Remove # from URLs
      $locationProvider.html5Mode(true);
  })
  .config(function ($httpProvider) {
    //$httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  })
  .constant('FBURL', 'https://hyena-timeclocks.firebaseio.com/')
  .constant('APIKEY', 'OWMyOGU3ZjQ1MTVjYmNkNGQ3NDlmY2Iz')
  .constant('APIPATH', 'http://st-studio.unl.edu/hyena_platform/public/api/1.0/')
  .constant('PLATFORM_ROOT', 'http://st-studio.unl.edu/hyena_platform/public/')
  .constant('AUTH_SCOPE', 'groups');
