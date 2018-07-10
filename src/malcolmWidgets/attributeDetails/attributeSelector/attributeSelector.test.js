import React from 'react';
import { push } from 'react-router-redux';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import AttributeSelector, {
  selectorFunction,
  getDefaultFromType,
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
          choices,
        },
        value,
        path: ['test1', 'attr'],
      };
    }
    return {
      meta: {
        tags: [tag],
        writeable: true,
      },
      value,
      path: ['test1', 'attr'],
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

  it('dispatches change and pending on click correctly for checkbox', () => {
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
        path: ['test1', 'attr'],
        flagType: 'pending',
        flagState: true,
      },
      type: 'malcolm:attributeflag',
    };
    const putAction = {
      payload: {
        path: ['test1', 'attr'],
        typeid: 'malcolm:core/Put:1.0',
        value: true,
      },
      type: 'malcolm:send',
    };
    expect(testStore.getActions()[0]).toEqual(pendingAction);
    expect(testStore.getActions()[1]).toEqual(putAction);
  });

  it('dispatches change and pending on click correctly for combobox', () => {
    const testStore = mockStore({});
    const wrapper = mount(
      <AttributeSelector
        attribute={buildAttribute('combo', '2', ['1', '2', '3'])}
        store={testStore}
      />
    );
    wrapper
      .find('option')
      .first()
      .simulate('change');
    const pendingAction = {
      payload: {
        path: ['test1', 'attr'],
        flagType: 'pending',
        flagState: true,
      },
      type: 'malcolm:attributeflag',
    };
    const putAction = {
      payload: {
        path: ['test1', 'attr'],
        typeid: 'malcolm:core/Put:1.0',
        value: '1',
      },
      type: 'malcolm:send',
    };
    expect(testStore.getActions()[0]).toEqual(pendingAction);
    expect(testStore.getActions()[1]).toEqual(putAction);
  });

  it('dispatches path change on table button click', () => {
    const testStore = mockStore({});
    const wrapper = mount(
      <AttributeSelector
        attribute={buildAttribute('table')}
        store={testStore}
      />
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(testStore.getActions()[0]).toEqual(push('/gui/test1/attr'));
  });

  it('dispatches path change on flowgraph button click', () => {
    const testStore = mockStore({});
    const wrapper = mount(
      <AttributeSelector
        attribute={buildAttribute('flowgraph')}
        store={testStore}
      />
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(testStore.getActions()[0]).toEqual(push('/gui/test1/attr'));
  });

  it('dispatches dirty on focus for textipnut', () => {
    const testStore = mockStore({});
    const wrapper = mount(
      <AttributeSelector
        attribute={buildAttribute('textinput', {})}
        store={testStore}
      />
    );
    wrapper.find('input').simulate('focus');
    const dirtyAction = {
      payload: {
        path: ['test1', 'attr'],
        flagType: 'dirty',
        flagState: true,
      },
      type: 'malcolm:attributeflag',
    };
    expect(testStore.getActions()[0]).toEqual(dirtyAction);
  });

  it('selector Function errors on no widget tag', () => {
    expect(() => selectorFunction('notAWidget')).toThrow(
      Error('no widget tag supplied!')
    );
  });

  it('getDefaultFromType returns correctly', () => {
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/BooleanMeta:1.0' })
    ).toEqual(false);
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/StringMeta:1.0' })
    ).toEqual('');
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/NumberMeta:1.0' })
    ).toEqual(0);
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/BooleanArrayMeta:1.0' })
    ).toEqual(false);
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/StringArrayMeta:1.0' })
    ).toEqual('');
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/NumberArrayMeta:1.0' })
    ).toEqual(0);
  });
});
