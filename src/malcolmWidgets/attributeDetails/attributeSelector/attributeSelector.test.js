import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import configureStore from 'redux-mock-store';
import AttributeSelector from './attributeSelector.component';

describe('AttributeSelector', () => {
  let shallow;
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore();
    shallow = createShallow({ dive: true });
  });

  const buildAttribute = (widget, value) => ({
    meta: {
      tags: [`widget:${widget}`],
    },
    value,
  });

  const runSelectorTest = attribute => {
    const wrapper = shallow(
      <AttributeSelector attribute={attribute} store={mockStore({})} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  };

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
});
