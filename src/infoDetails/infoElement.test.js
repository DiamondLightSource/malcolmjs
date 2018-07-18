import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import InfoElement from './infoElement.component';

describe('InfoElement', () => {
  let shallow;
  let mount;
  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <InfoElement
        key={1}
        label="Test element"
        value="testing..."
        alarm={null}
        tag="info:multiline"
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('button hooks up correctly', () => {
    const clickHandler = jest.fn();
    const wrapper = mount(
      <InfoElement
        key={1}
        label="Test element"
        value={{ buttonLabel: 'test button', disabled: false }}
        alarm={null}
        tag="info:button"
        handlers={{ clickHandler }}
      />
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('button disables correctly', () => {
    const clickHandler = jest.fn();
    const wrapper = mount(
      <InfoElement
        key={1}
        label="Test element"
        value={{ buttonLabel: 'test button', disabled: true }}
        alarm={null}
        tag="info:button"
        clickHandler={clickHandler}
      />
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(clickHandler).toHaveBeenCalledTimes(0);
  });
});
