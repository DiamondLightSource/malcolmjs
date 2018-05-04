import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import AttributeDetails from './attributeDetails.component';

describe('AttributeDetails', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <AttributeDetails name="Attribute 1" alarm={0}>
        <div>value</div>
      </AttributeDetails>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
