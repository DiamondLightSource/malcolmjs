import React from 'react';
import renderer from 'react-test-renderer';
import { Router } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import AppRouter from './App.routes';

it('renders route list correctly', () => {
  const history = createHistory();
  expect(
    renderer
      .create(
        <Router history={history}>
          <AppRouter />
        </Router>
      )
      .toJSON()
  ).toMatchSnapshot();
});
