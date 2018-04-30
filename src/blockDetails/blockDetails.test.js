import React from 'react';
import renderer from 'react-test-renderer';
import BlockDetails from './blockDetails.component';

it('renders correctly when loading', () => {
  const block = {
    loading: true,
  };

  const tree = renderer.create(<BlockDetails block={block} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly when loaded', () => {
  const block = {
    loading: false,
  };

  const tree = renderer.create(<BlockDetails block={block} />).toJSON();
  expect(tree).toMatchSnapshot();
});
