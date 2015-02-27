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
  .controller('TimeclockCtrl', function ($scope, $rootScope, $stateParams, UserService, TimeclockService, Notification) {
    $scope.moment = moment;
    var activeUserId = null; //Validated BB username will be put here.
    $scope.doingClockin = false;
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

    var showExistingClockinModal = function() {
      Notification.showModal('You have an existing clockin', '#modal-existing-clockin');
    };

    /**
     * Clocks out a specific clockin
     * @param string clockinId
     */
    $scope.clockOutById = function(clockinId) {
      console.log(clockinId);
      TimeclockService.clockOutById(clockinId).then(function(response) {
        Notification.show('Clocked out successfully!', 'success');
      }, function(error) {
        console.error(error);
        Notification.show('There was an error while clocking out!', 'error');
      });
    };

    /**
     * Attempts to clock in a user. If the user is already clocked in at the same timeclock,
     * it will simply clock the user out. If the user is already clocked in, but at a different
     * timeclock, they will be automatically clocked out at the other timeclock and clocked in
     * at the new one.
     */
    $scope.clockInUser = function() {
      $scope.doingClockin = true;
      //Validate the NUID and return BB username
      UserService.validate($scope.clockinNcard).then(function(user) {
        activeUserId = user.data.users_validated[0]; //BB username

        //Check for existing timeclocks
        TimeclockService.check(activeUserId).then(function(active_clockins) {
          //If the user is currently clocked in
          if(active_clockins.length > 0) {
            //Clock out existing clockins
            TimeclockService.clockOutByUser(activeUserId).then(function(response) {
              //Check and see if the active clock in is at the same timeclock
              //If it isn't, clock in
              if(active_clockins[0].timeclock_id !== timeclockId) {
                //$scope.doClockin();
                showExistingClockinModal();
              }
              else
              {
                $scope.doClockout();
              }
            });
          }
          //If not, just clock them in.
          else {
            $scope.doClockin();
          }
        }, function(error) {
          Notification.show(error);
        });
      });
    };

    $scope.doClockin = function() {
      TimeclockService.clockIn(timeclockId, activeUserId).then(function(response) {
        $scope.clockinNcard = "";
        $scope.clockinForm.$setPristine();
        $scope.doingClockin = false;
        Notification.show('You have been clocked in successfully!', 'success');
      }, function(error) {
        Notification.show(error.data, 'error');
      });
    }; 

    $scope.doClockout = function() {
      $scope.clockinNcard = "";
      $scope.clockinForm.$setPristine();
      $scope.doingClockin = false;
      Notification.show('You have been clocked out successfully!', 'success');
    };
  });
