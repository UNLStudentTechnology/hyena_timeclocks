'use strict';

describe('Service: TimeclockService', function () {

  // load the service's module
  beforeEach(module('hyenaTimeclocksApp'));

  // instantiate service
  var TimeclockService;
  beforeEach(inject(function (_TimeclockService_) {
    TimeclockService = _TimeclockService_;
  }));

  it('should do something', function () {
    expect(!!TimeclockService).toBe(true);
  });

});
