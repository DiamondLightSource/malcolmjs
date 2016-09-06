/**
 * Created by ig43 on 12/07/16.
 */
describe('app', function () {

    beforeEach(function() {
        fixture.base = 'js/__tests__/fixtures';
        fixture.load('app.fixture.html');
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        fixture.cleanup();
    });

    it('loads without problems', function () {
        console.log("app-test: ");
        require('../app');
    });
});
