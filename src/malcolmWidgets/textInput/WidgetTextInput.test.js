import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import WidgetTextInput from './WidgetTextInput.component';

const textInput = (
  value,
  pending,
  units,
  isDirty,
  setFlag = () => {},
  setValue = () => {}
) => (
  <WidgetTextInput
    Value={value}
    Pending={pending}
    submitEventHandler={setValue}
    focusHandler={() => {}}
    blurHandler={() => {}}
    Units={units}
    isDirty={isDirty}
    setFlag={setFlag}
  />
);

describe('WidgetTextUpdate', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
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

  it('displays dirty', () => {
    const wrapper = shallow(textInput('Goodbye World', true, null, true));
    expect(wrapper).toMatchSnapshot();
  });

  it('calls set dirty on focus', () => {
    const setDirty = jest.fn();
    const wrapper = mount(
      textInput('Hello World', false, null, false, setDirty)
    );
    wrapper
      .find('input')
      .first()
      .simulate('focus');
    expect(setDirty.mock.calls.length).toEqual(1);
    expect(setDirty.mock.calls[0]).toEqual(['dirty', true]);
  });

  it('calls unset dirty on focus if value unchanged', () => {
    const setDirty = jest.fn();
    const wrapper = mount(
      textInput('Hello World', false, null, false, setDirty)
    );
    wrapper
      .find('input')
      .first()
      .simulate('blur');
    expect(setDirty.mock.calls.length).toEqual(1);
    expect(setDirty.mock.calls[0]).toEqual(['dirty', false]);
  });

  it('doesnt call unset dirty on focus if value changed', () => {
    const setDirty = jest.fn();
    const wrapper = mount(
      textInput('Hello World', false, null, false, setDirty)
    );
    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'test' } })
      .simulate('blur');
    expect(setDirty.mock.calls.length).toEqual(1);
    expect(setDirty.mock.calls[0]).toEqual(['dirty', true]);
  });

  it('calls send on enter', () => {
    const mockData = { mock: { calls: [] } };
    const setValue = event => {
      mockData.mock.calls.push(event.target.value);
    };
    const wrapper = mount(
      textInput('Hello World', false, null, false, () => {}, setValue)
    );
    wrapper
      .find('input')
      .first()
      .simulate('keyPress', { key: 'Enter' });
    expect(mockData.mock.calls.length).toEqual(1);
    expect(mockData.mock.calls[0]).toEqual('Hello World');
  });
});
