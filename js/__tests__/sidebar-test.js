/**
 * Created by Ian Gillingham on 05/07/16.
 */
jest.enableAutomock();
jest.unmock('../views/sidebar')
jest.unmock ('object-assign')

import React from 'react';
import ReactDOM from 'react-dom';

import TestUtils from 'react-addons-test-utils';
import BothPanes from '../views/sidebar';

//const BothPanes = require('../views/sidebar')
describe('BothPanes', () => {
    it('creates and renders main pane and side pane areas', () => {
        // Render the panes
        var AppConstants = require('../constants/appConstants');
        const bothpanes = TestUtils.renderIntoDocument(
            <BothPanes />
        );

        const bothpanesNode = ReactDOM.findDOMNode(bothpanes);

        expect(bothpanesNode.tagName).toEqual("DIV");
    });
});
