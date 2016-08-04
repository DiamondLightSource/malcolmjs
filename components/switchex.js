/**
 * Created by ig43 on 02/08/16.
 */
import Switch from 'react-toolbox/lib/switch';
import theme from 'react-toolbox/lib/switch';
import React from 'react'

export class SwitchTest extends React.Component {
  state = {
    switch_1: true,
    switch_2: false,
    switch_3: true
  };

  handleChange = (field, value) => {
    this.setState({...this.state, [field]: value});
  };

  render () {
    return (
      <section>
        <Switch theme={theme}
          checked={this.state.switch_1}
          label="Push notifications"
          onChange={this.handleChange.bind(this, 'switch_1')}
        />
        <Switch
          checked={this.state.switch_2}
          label="Mail notifications"
          onChange={this.handleChange.bind(this, 'switch_2')}
        />
        <Switch
          checked={this.state.switch_3}
          disabled
          label="Nothing, thanks"
          onChange={this.handleChange.bind(this, 'switch_3')}
        />
      </section>
    );
  }
}

export default SwitchTest;
