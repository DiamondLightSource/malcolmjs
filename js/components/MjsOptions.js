/**
 * Created by Ian Gillingham on 21/08/17.
 */
//import * as React from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import { Checkbox } from 'react-toolbox/lib/checkbox';
//import  RadioGroup   from 'react-toolbox/lib/radio/RadioGroup';
//import  RadioButton  from 'react-toolbox/lib/radio/RadioButton';
import theme from '../styles/options.scss';
import optionsStore, {MjsOptionsStore} from '../stores/optionsStore';
import optionsActions from '../actions/optionsActions';

const gsStyle3d = 'style3d';
const gsStyleFlat = 'flat';

export default class MjsOptions extends Component {
  constructor(props)
  {
    super(props);
    this.__onStoreChange = this.__onStoreChange.bind(this);
    this.state = optionsStore.options;
  }

  componentDidMount()
  {
  optionsStore.addChangeListener(this.__onStoreChange);
  }

  componentWillUnmount()
  {}

  shouldComponentUpdate(nextProps, nextState)
  {
    let bRet = true;
    return (bRet);
  }

  /**
   * Called when the optionsStore updates
   * @private
   */
  __onStoreChange()
    {
    this.setState(optionsStore.options);
    }

/**
 * Called when the user changes the graph style.
 * @param value
 */
  handleChange = (value) => {
  switch (value)
    {
    case gsStyleFlat:
      optionsActions.GraphicsStyleSelect(MjsOptionsStore.gsFlat);
      break;
    case gsStyle3d:
      optionsActions.GraphicsStyleSelect(MjsOptionsStore.gs3d);
      break;
    default:
      break;
    }
  };

  checkPinned = (value) => {
    optionsActions.RightPanePinnedSelect(value);
    };

  render()
  {
    return (
      <div className={theme.container}>
      <RadioGroup theme={theme} name='Settings' value={this.state.value} onChange={this.handleChange}>
        <RadioButton theme={theme} label={'3D Styling'} value={gsStyle3d}/>
        <RadioButton theme={theme} label={'Flat and boring'} value={gsStyleFlat}/>
      </RadioGroup>
      <div>
      <Checkbox
        name={"Pinned"}
        checked={this.state.pinned}
        label={"Right Sidebar pinned"}
        onChange={this.checkPinned}
      />
      </div>
    </div>
    );
  }
}

MjsOptions.defaultProps = {
  cbClicked: null
};

MjsOptions.propTypes = {
  children: PropTypes.node
};
