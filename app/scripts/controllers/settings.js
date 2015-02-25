'use strict';

/**
 * @ngdoc function
 * @name hyenaTimeclocksApp.controller:SettingsctrlCtrl
 * @description
 * # SettingsctrlCtrl
 * Controller of the hyenaTimeclocksApp
 */
angular.module('hyenaTimeclocksApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, $stateParams, TimeclockService) {
  	//Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get timeclock id
  	var timeclockId = $scope.timeclockId = $stateParams.timeclockId;

  	//Get timeclock
  	var timeclock = TimeclockService.get(timeclockId).$asObject();
  	timeclock.$bindTo($scope, 'timeclock');
  });
