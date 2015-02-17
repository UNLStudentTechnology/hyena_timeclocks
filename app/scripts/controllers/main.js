'use strict';

/**
 * @ngdoc function
 * @name hyenaTimeclocksApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hyenaTimeclocksApp
 */
angular.module('hyenaTimeclocksApp')
  .controller('MainCtrl', function ($scope, $rootScope, $routeParams, TimeclockService, FirebaseGroupService) {
  	//Get the selected group from the route parameters and set it in the scope
    var groupId = $routeParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Check and see if the group exists in the Firebase, if not, add it.
    if(angular.isDefined(groupId))
      FirebaseGroupService.existsOrAdd(groupId);

  	//Get Assets
    if(groupId)
      $scope.timeclocks = TimeclockService.groupTimeclocks(groupId, 10).$asArray();

  });
