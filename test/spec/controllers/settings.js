'use strict';

describe('Controller: SettingsctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('hyenaTimeclocksApp'));

  var SettingsctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsctrlCtrl = $controller('SettingsctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
