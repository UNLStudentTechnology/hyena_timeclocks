/* global moment */
'use strict';

/**
 * @ngdoc function
 * @name hyenaTimeclocksApp.controller:TimeclockCtrl
 * @description
 * # TimeclockCtrl
 * Controller of the hyenaTimeclocksApp
 */
angular.module('hyenaTimeclocksApp')
  .controller('TimeclockCtrl', function ($scope, $rootScope, $stateParams, TimeclockService, Notification) {
    $scope.moment = moment;
    $scope.kioskMode = false;
    //Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get timeclock id
  	var timeclockId = $scope.timeclockId = $stateParams.timeclockId;

  	//Get timeclock
  	var timeclock = TimeclockService.get(timeclockId).$asObject();
  	timeclock.$bindTo($scope, 'timeclock');

    //Get clockins
    $scope.clockins = TimeclockService.past(timeclockId).$asArray();
    $scope.active_clockins = TimeclockService.active(timeclockId).$asArray();

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

    $scope.clockOutById = function(clockinId) {
      console.log(clockinId);
      TimeclockService.clockOutById(clockinId).then(function(response) {
        Notification.show('Clocked out successfully!', 'success');
      }, function(error) {
        console.error(error);
        Notification.show('There was an error while clocking out!', 'error');
      });
    };

    $scope.clockInUser = function() {
      TimeclockService.clockIn(timeclockId, $scope.clockinNcard).then(function(response) {
        $scope.clockinNcard = "";
        Notification.show('You have been clocked in successfully!', 'success');
      }, function(error) {
        console.error(error);
        Notification.show(error.data, 'error');
      });
    };
  });
