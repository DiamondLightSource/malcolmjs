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

it('renders correctly when metadata loaded and waiting for attributes', () => {
  const block = {
    loading: false,
    fields: [
      { name: 'health', loading: true },
      { name: 'icon', loading: true },
    ],
  };

  const tree = renderer.create(<BlockDetails block={block} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly when metadata loaded and attributes loaded', () => {
  const block = {
    loading: false,
    fields: [
      { name: 'health', loading: false },
      { name: 'icon', loading: false },
    ],
  };

  const tree = renderer.create(<BlockDetails block={block} />).toJSON();
  expect(tree).toMatchSnapshot();
});
