import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import WidgetTextInput from './WidgetTextInput.component';

const textInput = (value, pending, units) => (
  <WidgetTextInput
    Value={value}
    Pending={pending}
    submitEventHandler={() => {}}
    focusHandler={() => {}}
    blurHandler={() => {}}
    Units={units}
  />
);

describe('WidgetTextUpdate', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('displays text', () => {
    const wrapper = shallow(textInput('Hello World', false, null));
    expect(wrapper).toMatchSnapshot();
  });

  it('displays with units', () => {
    const wrapper = shallow(textInput('1.21', false, 'GW'));
    expect(wrapper).toMatchSnapshot();
  });

  it('displays disabled', () => {
    const wrapper = shallow(textInput('Goodbye World', true, null));
    expect(wrapper).toMatchSnapshot();
  });
});
