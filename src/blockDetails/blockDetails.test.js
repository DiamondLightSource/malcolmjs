import React from 'react';
import renderer from 'react-test-renderer';
import BlockDetails from './blockDetails.component';

it('renders correctly', () => {
  const tree = renderer.create(<BlockDetails />).toJSON();
  expect(tree).toMatchSnapshot();
});
