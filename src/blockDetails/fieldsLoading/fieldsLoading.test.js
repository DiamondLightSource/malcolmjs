import React from 'react';
import renderer from 'react-test-renderer';
import FieldsLoading from './fieldsLoading.component';

it('renders correctly', () => {
  const fields = [
    { name: 'health', loading: true },
    { name: 'icon', loading: false },
    { name: 'parameters', loading: true },
  ];

  const tree = renderer.create(<FieldsLoading attributes={fields} />).toJSON();
  expect(tree).toMatchSnapshot();
});
