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
    //Get and set the current group ID
  	var groupId = $routeParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get timeclock id
  	var timeclockId = $scope.timeclockId = $routeParams.timeclockId;

  	//Get timeclock
  	var timeclock = TimeclockService.get(timeclockId).$asObject();
  	timeclock.$bindTo($scope, 'timeclock');
  });
