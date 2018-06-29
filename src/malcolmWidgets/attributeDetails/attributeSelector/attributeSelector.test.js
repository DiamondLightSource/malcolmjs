import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import AttributeSelector, {
  selectorFunction,
} from './attributeSelector.component';

describe('AttributeSelector', () => {
  let shallow;
  let mockStore;
  let mount;

  beforeEach(() => {
    mockStore = configureStore();
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  const buildAttribute = (widget, value, choices) => {
    const tag = widget ? `widget:${widget}` : 'notAWidget';
    if (choices) {
      return {
        meta: {
          tags: [tag],
          writeable: true,
        },
        value,
        choices,
      };
    }
    return {
      meta: {
        tags: [tag],
        writeable: true,
      },
      value,
    };
  };

  const runSelectorTest = attribute => {
    const wrapper = shallow(
      <AttributeSelector attribute={attribute} store={mockStore({})} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  };

  it('shows a bug icon if the widget is not handled', () => {
    const attribute = buildAttribute('unknown', {});
    runSelectorTest(attribute);
  });

  it('selects an LED correctly', () => {
    const attribute = buildAttribute('led', true);
    runSelectorTest(attribute);
  });

  it('selects a checkbox correctly', () => {
    const attribute = buildAttribute('checkbox', true);
    runSelectorTest(attribute);
  });

  it('selects an textUpdate correctly', () => {
    const attribute = buildAttribute('textupdate', '1.23456');
    runSelectorTest(attribute);
  });

  it('selects a comboBox correctly', () => {
    const attribute = buildAttribute('combo', '1', ['1', '2', '3']);
    runSelectorTest(attribute);
  });

  it('selects a buttonAction correctly for layout', () => {
    const attribute = buildAttribute('flowgraph', {});
    runSelectorTest(attribute);
  });

  it('selects a buttonAction correctly for table', () => {
    const attribute = buildAttribute('table', {});
    runSelectorTest(attribute);
  });

  it('selects a textInput correctly', () => {
    const attribute = buildAttribute('textinput', {});
    runSelectorTest(attribute);
  });

  it('renders empty on no widget tag', () => {
    const attribute = buildAttribute(null, {});
    runSelectorTest(attribute);
  });

  it('dispatches change and pending on click', () => {
    const testStore = mockStore({});
    const wrapper = mount(
      <AttributeSelector
        attribute={buildAttribute('checkbox', true)}
        store={testStore}
      />
    );
    wrapper.find('input').simulate('change');
    const pendingAction = {
      payload: {
        path: undefined,
        flagType: 'pending',
        flagState: true,
      },
      type: 'malcolm:attributeflag',
    };
    const putAction = {
      payload: {
        path: undefined,
        typeid: 'malcolm:core/Put:1.0',
        value: true,
      },
      type: 'malcolm:send',
    };
    expect(testStore.getActions()[0]).toEqual(pendingAction);
    expect(testStore.getActions()[1]).toEqual(putAction);
  });

  it('selector Function errors on no widget tag', () => {
    expect(() => selectorFunction('notAWidget')).toThrow(
      Error('no widget tag supplied!')
    );
  });
});
