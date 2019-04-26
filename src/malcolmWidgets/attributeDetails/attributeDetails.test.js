import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import { Provider } from 'react-redux';
import AttributeDetails from './attributeDetails.component';
import navigationActions from '../../malcolm/actions/navigation.actions';
import { parentPanelTransition } from '../../viewState/viewState.actions';

jest.mock('../../viewState/viewState.actions');
jest.mock('../../malcolm/actions/navigation.actions');

jest.useFakeTimers();

describe('connectedAttributeDetails', () => {
  let shallow;
  let mockStore;
  let state;
  let mount;
  const actions = [];

  beforeEach(() => {
    navigationActions.navigateToInfo.mockClear();
    parentPanelTransition.mockClear();
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
          block2: {
            attributes: [],
          },
        },
      },
    };
  });

  const buildAttribute = (number = 1, linkTo = undefined) => ({
    calculated: {
      name: `Attribute${number}`,
    },
    raw: {
      alarm: {
        severity: 0,
      },
      meta: {
        label: `Attribute ${number}`,
        tags: [
          'widget:NOTAWIDGET',
          linkTo !== undefined ? `linkedvalue:${linkTo[1]}:${linkTo[0]}` : '',
        ],
      },
    },
  });

  it('renders correctly', () => {
    const attribute = buildAttribute();

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

  it('renders linked attributes correctly', () => {
    const attribute = buildAttribute(1, ['block2', 'Attribute1']);

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
    const attribute = buildAttribute();
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
  it('info button hooks up correctly if grandchild', () => {
    const attribute = buildAttribute();
    state.malcolm.blocks.block1.attributes.push(attribute);
    state.malcolm.childBlock = 'block1';

    const wrapper = mount(
      <Provider store={mockStore}>
        <AttributeDetails blockName="block1" attributeName="Attribute1" />
      </Provider>
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(parentPanelTransition).toHaveBeenCalledTimes(1);
    expect(parentPanelTransition).toHaveBeenCalledWith(true);
    jest.runAllTimers();
    expect(navigationActions.navigateToInfo).toHaveBeenCalledTimes(1);
    expect(navigationActions.navigateToInfo).toHaveBeenCalledWith(
      'block1',
      'Attribute1'
    );
    expect(parentPanelTransition).toHaveBeenCalledTimes(2);
    expect(parentPanelTransition).toHaveBeenCalledWith(false);
  });

  it('middle click hooks up correctly', () => {
    const attribute = buildAttribute();
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
