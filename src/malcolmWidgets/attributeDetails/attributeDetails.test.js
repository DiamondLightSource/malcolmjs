import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import AttributeDetails from './attributeDetails.component';

describe('AttributeDetails', () => {
  let shallow;
  let mockStore;
  let state;

  beforeEach(() => {
    mockStore = configureStore();
    shallow = createShallow({ dive: true });

    state = {
      malcolm: {
        blocks: {
          block1: {
            attributes: [],
          },
        },
      },
    };
  });

  it('renders correctly', () => {
    const attribute = {
      name: 'Attribute 1',
      alarm: {
        severity: 0,
      },
      meta: {
        label: 'Attribute 1',
        tags: ['widget:NOTAWIDGET'],
      },
    };

    state.malcolm.blocks.block1.attributes.push(attribute);

    const wrapper = shallow(
      <AttributeDetails
        blockName="block1"
        attributeName="Attribute 1"
        store={mockStore(state)}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('shows that it is unable to render unprocessed attributes', () => {
    const attribute = {
      name: 'Attribute 1',
      alarm: {
        severity: 0,
      },
      unableToProcess: true,
    };

    state.malcolm.blocks.block1.attributes.push(attribute);

    const wrapper = shallow(
      <AttributeDetails
        blockName="block1"
        attributeName="Attribute 1"
        store={mockStore(state)}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
