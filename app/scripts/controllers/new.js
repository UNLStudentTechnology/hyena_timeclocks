/* global moment */
'use strict';

/**
 * @ngdoc function
 * @name hyenaTimeclocksApp.controller:NewCtrl
 * @description
 * # NewCtrl
 * Controller of the hyenaTimeclocksApp
 */
angular.module('hyenaTimeclocksApp')
  .controller('NewCtrl', function ($scope, $rootScope, $stateParams, Notification, TimeclockService) {
    //Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Default timeclock settings
    $scope.timeclock = {
    	created_at: moment().format(),
        group_id: parseInt(groupId)
    };

    /**
     * Creates a new timeclock on the Firebase
     */
    $scope.createTimeclock = function() {
    	TimeclockService.add($scope.timeclock, groupId).then(function(response) {
    		console.log(response);
    		var timeclockId = response.key();
    		//Redirect and notify
    		$scope.go('/'+groupId+'/timeclock/'+timeclockId);
    		Notification.show('Your timeclock has been created successfully!', 'success');
    	}, function(error) {
    		console.log('Create timeclock Error', error);
    		Notification.show('There was an error creating your timeclock.', 'error');
    	});
    };
  });
