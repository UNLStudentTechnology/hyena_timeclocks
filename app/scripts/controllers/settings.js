'use strict';

/**
 * @ngdoc function
 * @name hyenaTimeclocksApp.controller:SettingsctrlCtrl
 * @description
 * # SettingsctrlCtrl
 * Controller of the hyenaTimeclocksApp
 */
angular.module('hyenaTimeclocksApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, $stateParams, TimeclockService, Notification) {
  	//Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get timeclock id
  	var timeclockId = $scope.timeclockId = $stateParams.timeclockId;

  	//Get timeclock
  	var timeclock = TimeclockService.get(timeclockId).$asObject();
  	timeclock.$bindTo($scope, 'timeclock');

    $scope.confirmRemoveTimeclock = function() {
      Notification.showModal('Remove Timeclock', '#modal-timeclock-remove');
    };

    $scope.removeTimeclock = function() {
      TimeclockService.remove(timeclockId).then(function() {
        Notification.hideModal();
        Notification.show('Your timeclock has been removed successfully!', 'success');

        //Navigate back to timeclocks
        $scope.go('/'+groupId, 'animate-slide-left');
      }, function(error) {
        Notification.hideModal();
        console.log('Remove checkpoint error:', error);
        Notification.show(error.message, 'error');
      });
    };
  });
