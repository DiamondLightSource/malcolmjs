import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import AttributeSelector from './attributeSelector.component';

describe('AttributeSelector', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  const buildAttribute = (widget, value) => ({
    meta: {
      tags: [`widget:${widget}`],
    },
    value,
  });

  const runSelectorTest = attribute => {
    const wrapper = shallow(<AttributeSelector attribute={attribute} />);
    expect(wrapper).toMatchSnapshot();
  };

  it('selects an LED correctly', () => {
    const attribute = buildAttribute('led', true);
    runSelectorTest(attribute);
  });

  it('selects an textUpdate correctly', () => {
    const attribute = buildAttribute('textupdate', true);
    runSelectorTest(attribute);
  });
});
