/**
 * Created by Ian Gillingham on 08/07/16.
 */
jest.enableAutomock();
jest.unmock('../stores/sidePaneStore')
jest.unmock ('object-assign')

//const BothPanes = require('../views/sidebar')
describe('sidePaneStore', () => {
    var AppConstants = require('../constants/appConstants');

    // mock actions inside dispatch payloads
    var actionDropdownShow = {
        source: 'VIEW_ACTION',
        action: {
            actionType: AppConstants.DROPDOWN_SHOW,
        }
    };
    var actionDropdownHide = {
        source: 'VIEW_ACTION',
        action: {
            actionType: AppConstants.DROPDOWN_HIDE,
        }
    };

    var AppDispatcher;
    var sidePaneStore;
    var callback;

    beforeEach(function() {
        AppDispatcher = require('../dispatcher/appDispatcher');
        sidePaneStore = require('../stores/sidePaneStore');
        callback = AppDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it('initializes with dropdown state false', function() {
        var ds = sidePaneStore.getDropdownState()
        expect(ds).toEqual(false);
    });

    it('Sets dropdown to show', function() {
        callback(actionDropdownShow);
        var dsState = sidePaneStore.getDropdownState()
        expect(dsState).toEqual(true);
    });

    it('Sets dropdown to hide', function() {
        callback(actionDropdownHide);
        var dsState = sidePaneStore.getDropdownState()
        expect(dsState).toEqual(false);
    });


});
