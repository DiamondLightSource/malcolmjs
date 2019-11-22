import React from 'react';
import { createShallow } from '@material-ui/core/test-utils'; // , createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import {
  malcolmTypes,
  Widget,
} from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

import AttributeViewer from './attributeView.container';

describe('attributeView', () => {
  let shallow;
  // let mount;
  let mockStore;
  let state;

  beforeEach(() => {
    mockStore = configureStore();
    shallow = createShallow({ dive: true });
    // mount = createMount();
    state = {
      malcolm: {
        parentBlock: 'test1',
        mainAttribute: 'health',
        layout: {
          blocks: [],
        },
        blocks: {
          test1: {
            attributes: [
              {
                calculated: {
                  name: 'health',
                },
                raw: {
                  meta: {
                    tags: [Widget.TEXTUPDATE],
                    typeid: malcolmTypes.string,
                  },
                },
              },
            ],
          },
        },
        blockArchive: {
          test1: {
            attributes: [{}],
          },
        },
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

  it('renders 1st tab correctly', () => {
    const wrapper = shallow(
      <AttributeViewer
        store={mockStore(state)}
        attributeName="health"
        blockName="test1"
        widgetTag={Widget.TEXTUPDATE}
        typeid={malcolmTypes.string}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders 2nd tab correctly', () => {
    const wrapper = shallow(
      <AttributeViewer
        store={mockStore(state)}
        attributeName="health"
        blockName="test1"
        widgetTag={Widget.TEXTUPDATE}
        typeid={malcolmTypes.string}
        defaultTab={1}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
