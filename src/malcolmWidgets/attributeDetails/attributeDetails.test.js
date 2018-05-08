import React from 'react';
import { createMount } from 'material-ui/test-utils';
import AttributeDetails from './attributeDetails.component';

describe('AttributeDetails', () => {
  let mount;

  beforeEach(() => {
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const attribute = {
      name: 'Attribute 1',
      alarm: {
        severity: 0,
      },
    };

    const wrapper = mount(
      <AttributeDetails attribute={attribute}>
        <div>value</div>
      </AttributeDetails>
    );
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

    const wrapper = mount(
      <AttributeDetails attribute={attribute}>
        <div>value</div>
      </AttributeDetails>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
