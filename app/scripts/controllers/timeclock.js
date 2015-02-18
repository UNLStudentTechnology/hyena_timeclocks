'use strict';

/**
 * @ngdoc function
 * @name hyenaTimeclocksApp.controller:TimeclockCtrl
 * @description
 * # TimeclockCtrl
 * Controller of the hyenaTimeclocksApp
 */
angular.module('hyenaTimeclocksApp')
  .controller('TimeclockCtrl', function ($scope, $rootScope, $routeParams, TimeclockService) {
    $scope.kioskMode = false;
    //Get and set the current group ID
  	var groupId = $routeParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get timeclock id
  	var timeclockId = $scope.timeclockId = $routeParams.timeclockId;

  	//Get timeclock
  	var timeclock = TimeclockService.get(timeclockId).$asObject();
  	timeclock.$bindTo($scope, 'timeclock');

    /**
     * Toggles kiosk mode, an interface for direct customer use.
     */
    $scope.showKioskMode = function() {
      $scope.hideMainDrawer();
      $scope.kioskMode = true;
    };

    $scope.hideKioskMode = function() {
      $scope.showMainDrawer();
      $scope.kioskMode = false;
    };
  });
