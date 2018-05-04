import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import GroupExpander from './groupExpander.component';

describe('GroupExpander', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  const expander = expanded => (
    <GroupExpander groupName="Test Group" expanded={expanded}>
      <div>Attribute 1</div>
      <div>Attribute 2</div>
      <div>Attribute 3</div>
    </GroupExpander>
  );

  it('renders when default expanded is false', () => {
    const wrapper = shallow(expander(false));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders when default expanded is true', () => {
    const wrapper = shallow(expander(true));
    expect(wrapper).toMatchSnapshot();
  });
});
