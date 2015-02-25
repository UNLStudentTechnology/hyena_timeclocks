"use strict";angular.module("hyenaTimeclocksApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","angularMoment","hyenaAngular","ngTagsInput","ngStorage"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){a.state("unl-layout",{templateUrl:"views/layouts/unl-layout.html",data:{requireAuth:!0}}).state("unl-layout-kiosk",{templateUrl:"views/layouts/unl-layout-kiosk.html"}).state("unl-layout.timeclocks",{url:"/:groupId",templateUrl:"views/main.html",controller:"MainCtrl"}).state("unl-layout.timeclock_new",{url:"/:groupId/timeclock/new",templateUrl:"views/new.html",controller:"NewCtrl"}).state("unl-layout.timeclock_settings",{url:"/:groupId/timeclock/:timeclockId/settings",templateUrl:"views/settings.html",controller:"SettingsCtrl"}).state("unl-layout.timeclock_view",{url:"/:groupId/timeclock/:timeclockId",templateUrl:"views/timeclock.html",controller:"TimeclockCtrl"}).state("unl-layout-kiosk.timeclock_kiosk",{url:"/:groupId/timeclock/:timeclockId/kiosk",templateUrl:"views/timeclock_kiosk.html",controller:"TimeclockCtrl"}),b.otherwise("/"),c.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://hyena-timeclocks.firebaseio.com/").constant("APIKEY","OWMyOGU3ZjQ1MTVjYmNkNGQ3NDlmY2Iz").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("PLATFORM_ROOT","http://st-studio.unl.edu/hyena_platform/public/").constant("AUTH_SCOPE","groups"),angular.module("hyenaTimeclocksApp").controller("MainCtrl",["$scope","$rootScope","$stateParams","TimeclockService","FirebaseGroupService",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f,angular.isDefined(f)&&""!==f&&e.existsOrAdd(f),""!==f&&(a.timeclocks=d.groupTimeclocks(f,10).$asArray())}]),angular.module("hyenaTimeclocksApp").service("TimeclockService",["$firebase","$q","AppFirebase","UserService",function(a,b,c,d){var e=c.getRef(),f={get:function(b){return b=b.trim(),a(e.child("/timeclocks/"+b))},groupTimeclocks:function(b,c){c=c||20,b=parseInt(b);var d=e.child("timeclocks").orderByChild("group_id").equalTo(b).limitToFirst(c);return a(d)},add:function(b,c){return a(e.child("timeclocks")).$push(b).then(function(b){return a(e.child("/groups/"+c+"/timeclocks")).$set(b.key(),!0),b})},remove:function(b){return b=b.trim(),a(e.child("/timeclocks/"+b)).$remove()},clockins:function(b){return a(e.child("/clockins/"+b))},active:function(b){return a(e.child("/active_clockins").orderByChild("timeclock_id").equalTo(b))},past:function(b){return a(e.child("/past_clockins").orderByChild("timeclock_id").equalTo(b))},clockIn:function(c,g){var h=b.defer(),i=null,j=null;return d.validate(g).then(function(b){i=b.data.users_validated[0],f.clockOutByUser(i).then(function(){j={start_at:moment().format(),timeclock_id:c,user:i},h.resolve(a(e.child("/active_clockins")).$push(j))},function(a){h.reject(a)})},function(a){h.reject(a)}),h.promise},clockOutByUser:function(c){var d=b.defer(),g=a(e.child("/active_clockins").orderByChild("user").equalTo(c)).$asArray();return g.$loaded().then(function(a){f.clockOut(a).then(function(a){d.resolve(a)},function(a){console.error("clockOutByUser Error:",a),d.reject(a)})}),d.promise},clockOutById:function(c){var d=b.defer(),g=a(e.child("/active_clockins").orderByKey().equalTo(c)).$asArray();return g.$loaded().then(function(a){console.log(a),d.resolve(f.clockOut(a))},function(a){d.reject(a)}),d.promise},clockOut:function(c){for(var d=[],f=0;f<c.length;f++){var g={end_at:moment().format(),start_at:c[f].start_at,timeclock_id:c[f].timeclock_id,user:c[f].user};a(e.child("/active_clockins/"+c[f].$id)).$remove(),d.push(a(e.child("/past_clockins")).$push(g))}return b.all(d)},check:function(c){var d=b.defer(),f=a(e.child("/active_clockins").orderByChild("user").equalTo(c)).$asArray();return f.$loaded().then(function(a){d.resolve(a.length)},function(){d.reject("Error getting clockins.")}),d.promise}};return f}]),angular.module("hyenaTimeclocksApp").controller("NewCtrl",["$scope","$rootScope","$stateParams","Notification","TimeclockService",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f,a.timeclock={created_at:moment().format(),group_id:parseInt(f)},a.createTimeclock=function(){e.add(a.timeclock,f).then(function(b){console.log(b);var c=b.key();a.go("/"+f+"/timeclock/"+c),d.show("Your timeclock has been created successfully!","success")},function(a){console.log("Create timeclock Error",a),d.show("There was an error creating your timeclock.","error")})}}]),angular.module("hyenaTimeclocksApp").controller("TimeclockCtrl",["$scope","$rootScope","$stateParams","TimeclockService","Notification",function(a,b,c,d,e){a.moment=moment,a.kioskMode=!1;var f=c.groupId;a.groupId=b.currentGroupId=f;var g=a.timeclockId=c.timeclockId,h=d.get(g).$asObject();h.$bindTo(a,"timeclock"),a.clockins=d.past(g).$asArray(),a.active_clockins=d.active(g).$asArray(),a.showKioskMode=function(){a.hideMainDrawer(),a.kioskMode=!0},a.hideKioskMode=function(){a.showMainDrawer(),a.kioskMode=!1},a.clockOutById=function(a){console.log(a),d.clockOutById(a).then(function(){e.show("Clocked out successfully!","success")},function(a){console.error(a),e.show("There was an error while clocking out!","error")})},a.clockInUser=function(){d.clockIn(g,a.clockinNcard).then(function(){a.clockinNcard="",e.show("You have been clocked in successfully!","success")},function(a){console.error(a),e.show(a.data,"error")})}}]),angular.module("hyenaTimeclocksApp").controller("SettingsCtrl",["$scope","$rootScope","$stateParams","TimeclockService",function(a,b,c,d){var e=c.groupId;a.groupId=b.currentGroupId=e;var f=a.timeclockId=c.timeclockId,g=d.get(f).$asObject();g.$bindTo(a,"timeclock")}]);