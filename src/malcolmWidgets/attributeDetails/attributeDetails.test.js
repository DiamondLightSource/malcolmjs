import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import AttributeDetails from './attributeDetails.component';

describe('AttributeDetails', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly', () => {
    const attribute = {
      name: 'Attribute 1',
      alarm: {
        severity: 0,
      },
      meta: {
        label: 'Attribute 1',
      },
    };

    const wrapper = shallow(<AttributeDetails attribute={attribute} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('shows that it is unable to render unprocessed attributes', () => {
    const attribute = {
      name: 'Attribute 1',
      alarm: {
        severity: 0,
      },
      unableToProcess: true,
    };

    const wrapper = shallow(<AttributeDetails attribute={attribute} />);
    expect(wrapper).toMatchSnapshot();
  });
});
