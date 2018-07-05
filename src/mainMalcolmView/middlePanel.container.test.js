import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { malcolmSelectBlock } from '../malcolm/malcolmActionCreators';

import MiddlePanel from './middlePanel.container';

describe('MalcolmMiddlePanel', () => {
  let shallow;
  let mount;
  let state;
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore();
    shallow = createShallow({ dive: true });
    mount = createMount();
    state = {
      malcolm: {
        parentBlock: 'test1',
        mainAttribute: 'layout',
        layout: {
          blocks: [],
        },
        blocks: {
          test1: {
            attributes: [
              {
                name: 'layout',
                meta: {
                  tags: ['widget:flowgraph'],
                },
              },
              {
                name: 'health',
                meta: {
                  tags: ['widget:textupdate'],
                },
              },
              {
                name: 'notAWidget',
                meta: {
                  tags: ['notAWidgetTag'],
                },
              },
            ],
          },
        },
        layoutState: {},
      },
      viewState: {
        openParentPanel: true,
      },
      router: {
        location: {
          pathname: '',
        },
      },
    };
  });

  it('renders layout correctly', () => {
    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders table correctly', () => {
    state.malcolm.blocks.test1.attributes[0].meta.tags = ['widget:table'];
    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders alarmed correctly', () => {
    state.malcolm.blocks.test1.attributes[0].alarm = {
      severity: AlarmStates.UNDEFINED_ALARM,
    };
    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders errored correctly', () => {
    state.malcolm.blocks.test1.attributes[0].errorState = true;

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders pending correctly', () => {
    state.malcolm.blocks.test1.attributes[0].pending = true;
    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders a container only if the mainAttribute is not one of allowed type', () => {
    state.malcolm.mainAttribute = 'health';

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders a container only if the no widget tag found for mainAttribute', () => {
    state.malcolm.mainAttribute = 'notAWidget';

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('calls deselect on click', () => {
    const testStore = mockStore(state);
    const wrapper = mount(
      <Provider store={testStore}>
        <MiddlePanel />
      </Provider>
    );
    wrapper
      .find('div')
      .first()
      .simulate('click');
    expect(testStore.getActions().length).toEqual(1);
    expect(testStore.getActions()[0]).toEqual(malcolmSelectBlock(''));
  });
});
