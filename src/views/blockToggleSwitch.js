/**
 * Created by twi18192 on 22/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import ToggleSwitch from 'react-toggle';

export default class BlockToggleSwitch extends React.Component
{
  constructor(props)
    {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    }
  
  shouldComponentUpdate (nextProps, nextState)
    {
    return ( nextProps.blockAttributeValue !== this.props.blockAttributeValue  )
    }

  handleMalcolmCall (blockName, method, args)
    {
    MalcolmActionCreators.malcolmCall(blockName, method, args)
    }

  /**
   * handleOnChange(): Presented as a callback reference (prop) to the underlying toggle switch component.
    * @param e
   */
  handleOnChange (e)
    {

    let methodToInvoke;

    /* Check the blockName if it's VISIBILITY or not */

    if (this.props.blockName === 'VISIBILITY')
      {
      /* What may cause some confusion is that in the context
       of VISIBILITY, the name of a block is one of its attributes,
       but in the context of a block an attribute will be
       inputs, outputs, parameters etc
       */
      methodToInvoke = '_set_' + this.props.attributeName + '_visible';
      }
    else
      {
      if (this.props.attributeName === 'VISIBLE')
        {
        methodToInvoke = '_set_' + this.props.attributeName.toLowerCase();
        }
      else
        {
        methodToInvoke = '_set_' + this.props.attributeName;
        }
      }

    /* If I'm toggling, I want to pass the OPPOSITE of
     whatever the current value of the toggle is, whether
     it's a string specifying visibility, or a boolean
     specifying some other attribute
     */

    let newValue;
    let argsObject = {};

    if (typeof this.props.blockAttributeValue === 'string')
      {
      if (this.props.blockAttributeValue === 'Show')
        {
        newValue = 'Hide';
        }
      else if (this.props.blockAttributeValue === 'Hide')
        {
        newValue = 'Show'
        }
      }
    else if (typeof this.props.blockAttributeValue === 'boolean')
      {
      newValue = !this.props.blockAttributeValue;
      }

    argsObject[this.props.attributeName] = newValue;

    this.handleMalcolmCall(this.props.blockName, methodToInvoke, argsObject);

    }

  render ()
    {

    return (

      <div style={{display: 'flex', justifyContent: 'space-between', left: '45'}}>
        <p style={{margin: '0px', width: '40px', position: 'relative'}}>{"False"}</p>
        <div id={"testToggleSwitch"} style={{height: '16', width: '44', marginLeft: '25'}}>
          <ToggleSwitch onChange={this.handleOnChange}
                        checked={this.props.blockAttributeValue === 'Show' ||
                        this.props.blockAttributeValue === true}
                        id={this.props.blockName + 'toggleSwitch'}
                        on={this.props.blockAttributeValue === 'Show' ||
                        this.props.blockAttributeValue === true}/>
        </div>
        <p style={{margin: '0px', width: '40px', marginLeft: '22'}}>{"True"}</p>
      </div>

    )
    }
}

BlockToggleSwitch.propTypes = {
blockAttributeValue: PropTypes.any.isRequired,
  blockName          : PropTypes.string.isRequired,
  attributeName      : PropTypes.string.isRequired
};

