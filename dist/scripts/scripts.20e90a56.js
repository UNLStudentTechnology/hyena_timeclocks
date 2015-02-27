"use strict";angular.module("hyenaTimeclocksApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","angularMoment","hyenaAngular","ngTagsInput","ngStorage"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){a.state("unl-layout",{templateUrl:"views/layouts/unl-layout.html",data:{requireAuth:!0}}).state("unl-layout-kiosk",{templateUrl:"views/layouts/unl-layout-kiosk.html",data:{requireAuth:!1}}).state("unl-layout.timeclocks",{url:"/:groupId",templateUrl:"views/main.html",controller:"MainCtrl"}).state("unl-layout.timeclock_new",{url:"/:groupId/timeclock/new",templateUrl:"views/new.html",controller:"NewCtrl"}).state("unl-layout.timeclock_settings",{url:"/:groupId/timeclock/:timeclockId/settings",templateUrl:"views/settings.html",controller:"SettingsCtrl"}).state("unl-layout.timeclock_view",{url:"/:groupId/timeclock/:timeclockId",templateUrl:"views/timeclock.html",controller:"TimeclockCtrl"}).state("unl-layout-kiosk.timeclock_kiosk",{url:"/:groupId/timeclock/:timeclockId/kiosk",templateUrl:"views/timeclock_kiosk.html",controller:"TimeclockCtrl"}),b.otherwise("/"),c.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://hyena-timeclocks.firebaseio.com/").constant("APIKEY","OWMyOGU3ZjQ1MTVjYmNkNGQ3NDlmY2Iz").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("PLATFORM_ROOT","http://st-studio.unl.edu/hyena_platform/public/").constant("AUTH_SCOPE","groups"),angular.module("hyenaTimeclocksApp").controller("MainCtrl",["$scope","$rootScope","$stateParams","TimeclockService","FirebaseGroupService",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f,angular.isDefined(f)&&""!==f&&e.existsOrAdd(f),""!==f&&(a.timeclocks=d.groupTimeclocks(f,10).$asArray())}]),angular.module("hyenaTimeclocksApp").service("TimeclockService",["$firebase","$q","AppFirebase",function(a,b,c){var d=c.getRef(),e={get:function(b){return b=b.trim(),a(d.child("/timeclocks/"+b))},groupTimeclocks:function(b,c){c=c||20,b=parseInt(b);var e=d.child("timeclocks").orderByChild("group_id").equalTo(b).limitToFirst(c);return a(e)},add:function(b,c){return a(d.child("timeclocks")).$push(b).then(function(b){return a(d.child("/groups/"+c+"/timeclocks")).$set(b.key(),!0),b})},remove:function(b){return b=b.trim(),e.removeClockins(b),a(d.child("/timeclocks/"+b)).$remove()},removeClockins:function(b){return b=b.trim(),a(d.child("/past_clockins").orderByChild("timeclock_id").equalTo(b)).$remove()},clockins:function(b){return a(d.child("/clockins/"+b))},active:function(b){return a(d.child("/active_clockins").orderByChild("timeclock_id").equalTo(b))},past:function(b){return a(d.child("/past_clockins").orderByChild("timeclock_id").equalTo(b))},clockIn:function(b,c){var e={start_at:moment().format(),timeclock_id:b,user:c};return a(d.child("/active_clockins")).$push(e)},clockOutByUser:function(c){var f=b.defer(),g=a(d.child("/active_clockins").orderByChild("user").equalTo(c)).$asArray();return g.$loaded().then(function(a){e.clockOut(a).then(function(a){f.resolve(a)},function(a){console.error("clockOutByUser Error:",a),f.reject(a.message)})}),f.promise},clockOutById:function(c){var f=b.defer(),g=a(d.child("/active_clockins").orderByKey().equalTo(c)).$asArray();return g.$loaded().then(function(a){console.log(a),f.resolve(e.clockOut(a))},function(a){f.reject(a)}),f.promise},clockOut:function(c){for(var e=[],f=0;f<c.length;f++){var g={end_at:moment().format(),start_at:c[f].start_at,timeclock_id:c[f].timeclock_id,user:c[f].user};a(d.child("/active_clockins/"+c[f].$id)).$remove(),e.push(a(d.child("/past_clockins")).$push(g))}return b.all(e)},check:function(c){var e=b.defer(),f=a(d.child("/active_clockins").orderByChild("user").equalTo(c)).$asArray();return f.$loaded().then(function(a){e.resolve(a)},function(a){console.error("TimeclockService.check()",a),e.reject("Error getting clockins.")}),e.promise}};return e}]),angular.module("hyenaTimeclocksApp").controller("NewCtrl",["$scope","$rootScope","$stateParams","Notification","TimeclockService",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f,a.timeclock={created_at:moment().format(),group_id:parseInt(f)},a.createTimeclock=function(){e.add(a.timeclock,f).then(function(b){console.log(b);var c=b.key();a.go("/"+f+"/timeclock/"+c),d.show("Your timeclock has been created successfully!","success")},function(a){console.log("Create timeclock Error",a),d.show("There was an error creating your timeclock.","error")})}}]),angular.module("hyenaTimeclocksApp").controller("TimeclockCtrl",["$scope","$rootScope","$stateParams","UserService","TimeclockService","Notification",function(a,b,c,d,e,f){a.moment=moment;var g=null;a.doingClockin=!1;var h=c.groupId;a.groupId=b.currentGroupId=h;var i=a.timeclockId=c.timeclockId,j=e.get(i).$asObject();j.$bindTo(a,"timeclock"),a.clockins=e.past(i).$asArray(),a.active_clockins=e.active(i).$asArray(),a.showKioskMode=function(){a.hideMainDrawer(),a.kioskMode=!0},a.hideKioskMode=function(){a.showMainDrawer(),a.kioskMode=!1};var k=function(){f.showModal("You have an existing clockin","#modal-existing-clockin")};a.clockOutById=function(a){console.log(a),e.clockOutById(a).then(function(){f.show("Clocked out successfully!","success")},function(a){console.error(a),f.show("There was an error while clocking out!","error")})},a.clockInUser=function(){a.doingClockin=!0,d.validate(a.clockinNcard).then(function(b){g=b.data.users_validated[0],e.check(g).then(function(b){b=angular.copy(b),b.length>0?e.clockOutByUser(g).then(function(){b[0].timeclock_id!==i?k():a.doClockout()}):a.doClockin()},function(a){f.show(a)})})},a.doClockin=function(){e.clockIn(i,g).then(function(){a.clockinNcard="",a.clockinForm.$setPristine(),a.doingClockin=!1,f.show("You have been clocked in successfully!","success")},function(a){f.show(a.data,"error")})},a.doClockout=function(){a.clockinNcard="",a.clockinForm.$setPristine(),a.doingClockin=!1,f.show("You have been clocked out successfully!","success")}}]),angular.module("hyenaTimeclocksApp").controller("SettingsCtrl",["$scope","$rootScope","$stateParams","TimeclockService","Notification",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f;var g=a.timeclockId=c.timeclockId,h=d.get(g).$asObject();h.$bindTo(a,"timeclock"),a.confirmRemoveTimeclock=function(){e.showModal("Remove Timeclock","#modal-timeclock-remove")},a.removeTimeclock=function(){d.remove(g).then(function(){e.hideModal(),e.show("Your timeclock has been removed successfully!","success"),a.go("/"+f,"animate-slide-left")},function(a){e.hideModal(),console.log("Remove checkpoint error:",a),e.show(a.message,"error")})}}]);