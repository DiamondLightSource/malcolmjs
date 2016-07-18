/**
 * Created by Ian Gillingham on 05/07/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import TestUtils from 'react-addons-test-utils';
import BothPanes from '../views/sidebar';

//const BothPanes = require('../views/sidebar')
describe('BothPanes', () => {

    beforeEach(function() {
        fixture.base = 'js/__tests__/fixtures';
        fixture.load('app.fixture.html');
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        fixture.cleanup();
    });

    it('creates and renders main pane and side pane areas', () => {
        // Render the panes
        var AppConstants = require('../constants/appConstants');
        const bothpanes = TestUtils.renderIntoDocument(
            <BothPanes />
        );

        const bothpanesNode = ReactDOM.findDOMNode(bothpanes);

        expect(bothpanesNode.tagName).to.equal("DIV");
    });
});
