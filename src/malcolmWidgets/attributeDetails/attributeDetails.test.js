import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import { Provider } from 'react-redux';
import AttributeDetails from './attributeDetails.component';
import navigationActions from '../../malcolm/actions/navigation.actions';

jest.mock('../../malcolm/actions/navigation.actions');

describe('AttributeDetails', () => {
  let shallow;
  let mockStore;
  let state;
  let mount;
  const actions = [];

  beforeEach(() => {
    mockStore = {
      getState: () => state,
      dispatch: action => actions.push(action),
      subscribe: () => {},
    };
    shallow = createShallow({ dive: true });
    mount = createMount();

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
      calculated: {
        name: 'Attribute1',
      },
      raw: {
        alarm: {
          severity: 0,
        },
        meta: {
          label: 'Attribute 1',
          tags: ['widget:NOTAWIDGET'],
        },
      },
    };

    state.malcolm.blocks.block1.attributes.push(attribute);

    const wrapper = shallow(
      <AttributeDetails
        blockName="block1"
        attributeName="Attribute1"
        store={mockStore}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('info button hooks up correctly', () => {
    const attribute = {
      calculated: {
        name: 'Attribute1',
      },
      raw: {
        alarm: {
          severity: 0,
        },
        meta: {
          label: 'Attribute 1',
          tags: ['widget:NOTAWIDGET'],
        },
      },
    };

    state.malcolm.blocks.block1.attributes.push(attribute);

    const wrapper = mount(
      <Provider store={mockStore}>
        <AttributeDetails blockName="block1" attributeName="Attribute1" />
      </Provider>
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(navigationActions.navigateToInfo).toHaveBeenCalledTimes(1);
    expect(navigationActions.navigateToInfo).toHaveBeenCalledWith(
      'block1',
      'Attribute1'
    );
  });

  it('middle click hooks up correctly', () => {
    const attribute = {
      calculated: {
        name: 'Attribute1',
      },
      raw: {
        alarm: {
          severity: 0,
        },
        meta: {
          label: 'Attribute 1',
          tags: ['widget:NOTAWIDGET'],
        },
      },
    };

    state.malcolm.blocks.block1.attributes.push(attribute);

    const wrapper = mount(
      <Provider store={mockStore}>
        <AttributeDetails blockName="block1" attributeName="Attribute1" />
      </Provider>
    );

    if (document.execCommand === undefined) {
      Object.defineProperty(document, 'execCommand', { value: jest.fn() });
    }
    wrapper
      .find('p')
      .first()
      .simulate('mouseDown', { button: 1 });
    expect(document.execCommand).toHaveBeenCalledTimes(1);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('shows that it is unable to render unprocessed attributes', () => {
    const attribute = {
      name: 'Attribute1',
      alarm: {
        severity: 0,
      },
      unableToProcess: true,
    };

    state.malcolm.blocks.block1.attributes.push(attribute);

    const wrapper = shallow(
      <AttributeDetails
        blockName="block1"
        attributeName="Attribute1"
        store={mockStore}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
