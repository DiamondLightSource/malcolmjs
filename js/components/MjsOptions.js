/**
 * Created by Ian Gillingham on 21/08/17.
 */
//import * as React from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
//import  RadioGroup   from 'react-toolbox/lib/radio/RadioGroup';
//import  RadioButton  from 'react-toolbox/lib/radio/RadioButton';
import styles from '../styles/options.scss';

export default class MjsOptions extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
            value: 'vvendetta'
            };
  }

  componentDidMount()
  {}

  componentWillUnmount()
  {}

  shouldComponentUpdate(nextProps, nextState)
  {
    let bRet = true;
    return (bRet);
  }

  handleChange = (value) => {
    this.setState({value});
  };

  render()
  {
    return (
      <RadioGroup name='comic' value={this.state.value} onChange={this.handleChange}>
        <RadioButton label='The Walking Dead' value='thewalkingdead'/>
        <RadioButton label='From Hell' value='fromhell' disabled/>
        <RadioButton label='V for a Vendetta' value='vvendetta'/>
        <RadioButton label='Watchmen' value='watchmen'/>
      </RadioGroup>
    );
  }
}

MjsOptions.defaultProps = {
  cbClicked: null
};

MjsOptions.propTypes = {
  children: PropTypes.node
};
