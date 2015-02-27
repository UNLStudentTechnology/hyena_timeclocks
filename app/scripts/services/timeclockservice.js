/* global moment */
'use strict';

/**
 * @ngdoc service
 * @name hyenaTimeclocksApp.TimeclockService
 * @description
 * # TimeclockService
 * Service in the hyenaTimeclocksApp.
 */
angular.module('hyenaTimeclocksApp')
  .service('TimeclockService', function ($firebase, $q, AppFirebase) {
  	var timeclockRef = AppFirebase.getRef();
    
    var TimeclockService =  {
      /**
       * Gets a specific timeclock
       * @param  string timeclockId
       * @return promise
       */
    	get: function getTimeclock(timeclockId) {
    		timeclockId = timeclockId.trim();
  			return $firebase(timeclockRef.child('/timeclocks/'+timeclockId));
    	},
      /**
       * Get all timeclocks associated with a group
       * @param  int groupId Group ID
       * @param  int limit   Number of items to return
       * @return promise
       */
    	groupTimeclocks: function getGroupTimeclocks(groupId, limit) {
    		limit = limit || 20;
    		groupId = parseInt(groupId);
    		var timeclocks = timeclockRef.child('timeclocks').orderByChild("group_id").equalTo(groupId).limitToFirst(limit);
        	return $firebase(timeclocks);
    	},
      /**
       * Create a new timeclock
       * @param string timeclock
       * @param int groupId
       */
    	add: function addTimeclock(timeclock, groupId) {
    		return $firebase(timeclockRef.child('timeclocks')).$push(timeclock).then(function(response) {
	          //Add a reference to the group
	          $firebase(timeclockRef.child('/groups/'+groupId+'/timeclocks')).$set(response.key(), true);
	          return response;
	        });
    	},
      /**
       * Remove timeclock and its associated clockins
       * @param  string timeclockId
       * @return promise
       */
    	remove: function removeTimeclock(timeclockId) {
  			timeclockId = timeclockId.trim();
        TimeclockService.removeClockins(timeclockId);
  			return $firebase(timeclockRef.child('/timeclocks/'+timeclockId)).$remove();
  		},
      removeClockins: function removeClockins(timeclockId) {
        timeclockId = timeclockId.trim();
        return $firebase(timeclockRef.child('/past_clockins').orderByChild("timeclock_id").equalTo(timeclockId)).$remove();
      },
    	clockins: function getClockins(timeclockId) {
        return $firebase(timeclockRef.child('/clockins/'+timeclockId));
    	},
      active: function getActiveClockins(timeclockId) {
        return $firebase(timeclockRef.child('/active_clockins').orderByChild("timeclock_id").equalTo(timeclockId));
      },
      past: function getPastClockins(timeclockId) {
        return $firebase(timeclockRef.child('/past_clockins').orderByChild("timeclock_id").equalTo(timeclockId));
      },
      /**
       * Begins the clock in flow. 
       * @param  string timeclockId
       * @param  string nuid
       * @return promise
       */
      clockIn: function clockinUser(timeclockId, userId) {
        //Create our clockin object
        var clockin = {
          'start_at': moment().format(),
          'timeclock_id': timeclockId,
          'user': userId
        };

        //Push new clockin
        return $firebase(timeclockRef.child('/active_clockins')).$push(clockin);
      },
      /**
       * Clock out any active clockins for a particular user
       * @param  string userId BB username
       * @return promise
       */
      clockOutByUser: function clockoutUser(userId) {
        var deferred = $q.defer();
        var clockins = $firebase(timeclockRef.child('/active_clockins').orderByChild('user').equalTo(userId)).$asArray();
        clockins.$loaded().then(function(response) {
          TimeclockService.clockOut(response).then(function(response) {
            deferred.resolve(response);
          }, function(error) {
            console.error('clockOutByUser Error:', error);
            deferred.reject(error.message);
          });
        });
        return deferred.promise;
      },
      /**
       * Clock out a specific clock in
       * @param  string clockinId Clockin ID
       * @return promise
       */
      clockOutById: function clockOutById(clockinId) {
        var deferred = $q.defer();
        //Get the active clockin
        var clockinObject = $firebase(timeclockRef.child('/active_clockins').orderByKey().equalTo(clockinId)).$asArray();
        clockinObject.$loaded().then(function(response) {
          console.log(response);
          deferred.resolve(TimeclockService.clockOut(response));
        }, function(error) {
          deferred.reject(error);
        });

        return deferred.promise;
      },
      /**
       * Takes an array of active_clockins and clocks them out. Used by the other clock out functions.
       * @param  array clockins
       * @return promise
       */
      clockOut: function clockOutClockins(clockins) {
        var promises = [];
        for (var i = 0; i < clockins.length; i++) {
          //Create our clockin object
          var new_clockin = {
            'end_at': moment().format(),
            'start_at': clockins[i].start_at,
            'timeclock_id': clockins[i].timeclock_id,
            'user': clockins[i].user
          };

          //Clockin loaded, move to past_clockins and delete
          $firebase(timeclockRef.child('/active_clockins/'+clockins[i].$id)).$remove();
          promises.push($firebase(timeclockRef.child('/past_clockins')).$push(new_clockin));
        }

        return $q.all(promises);
      },
      /**
       * Checks to see if the user has any active clockins
       * @param  string userId      BB username
       * @return promise
       */
      check: function checkClockinStatus(userId) {
        var deferred = $q.defer();

        var statusObject = $firebase(timeclockRef.child('/active_clockins').orderByChild('user').equalTo(userId)).$asArray();
        statusObject.$loaded().then(function(response) {
          deferred.resolve(response);
        }, function(error) {
          console.error('TimeclockService.check()', error);
          deferred.reject('Error getting clockins.');
        });

        return deferred.promise;
      }
    };

    return TimeclockService;
  });
