import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import MiddlePanel from './middlePanel.container';

describe('MalcolmMiddlePanel', () => {
  let shallow;
  let state;
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore();
    shallow = createShallow({ dive: true });
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
                calculated: {
                  name: 'layout',
                },
                raw: {
                  meta: {
                    tags: ['widget:flowgraph'],
                  },
                },
              },
              {
                calculated: {
                  name: 'health',
                },
                raw: {
                  meta: {
                    tags: ['widget:textupdate'],
                    typeid: malcolmTypes.string,
                  },
                },
              },
              {
                calculated: {
                  name: 'notAWidget',
                },
                raw: {
                  meta: {
                    tags: ['notAWidgetTag'],
                  },
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
    state.malcolm.blocks.test1.attributes[0].raw.meta.tags = ['widget:table'];
    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders alarmed correctly', () => {
    state.malcolm.blocks.test1.attributes[0].raw.alarm = {
      severity: AlarmStates.UNDEFINED_ALARM,
    };
    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders errored correctly', () => {
    state.malcolm.blocks.test1.attributes[0].calculated.errorState = true;

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders pending correctly', () => {
    state.malcolm.blocks.test1.attributes[0].calculated.pending = true;
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
});
