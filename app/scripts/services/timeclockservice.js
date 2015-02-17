'use strict';

/**
 * @ngdoc service
 * @name hyenaTimeclocksApp.TimeclockService
 * @description
 * # TimeclockService
 * Service in the hyenaTimeclocksApp.
 */
angular.module('hyenaTimeclocksApp')
  .service('TimeclockService', function ($firebase, AppFirebase, $q) {
  	var timeclockRef = AppFirebase.getRef();
    
    var TimeclockService =  {
    	get: function getTimeclock(timeclockId) {
    		timeclockId = timeclockId.trim();
  			return $firebase(timeclockRef.child('/timeclocks/'+timeclockId));
    	},
    	groupTimeclocks: function getGroupTimeclocks(groupId, limit) {
    		limit = limit || 20;
    		groupId = parseInt(groupId);
    		var timeclocks = timeclockRef.child('timeclocks').orderByChild("group_id").equalTo(groupId).limitToFirst(limit);
        	return $firebase(timeclocks);
    	},
    	add: function addTimeclock(timeclock, groupId) {
    		return $firebase(timeclockRef.child('timeclocks')).$push(timeclock).then(function(response) {
	          //Add a reference to the group
	          $firebase(timeclockRef.child('/groups/'+groupId+'/timeclocks')).$set(response.key(), true);
	          return response;
	        });
    	},
    	remove: function removeAsset(timeclockId) {
  			timeclockId = timeclockId.trim();
  			return $firebase(timeclockRef.child('/timeclocks/'+timeclockId)).$remove();
  		},
    	clockins: function getClockins(timeclockId) {

    	}
    };

    return TimeclockService;
  });
