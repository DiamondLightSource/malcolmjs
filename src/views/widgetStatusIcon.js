/**
 * Created by twi18192 on 18/04/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

import paneActions from '../actions/paneActions';

export default class WidgetStatusIcon extends React.Component
  {
  constructor(props)
    {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
    }

    shouldComponentUpdate (nextProps, nextState)
      {
      return (
        nextProps.blockAttribute.value !== this.props.blockAttribute.value ||
        nextProps.blockAttributeStatus.value !== this.props.blockAttributeStatus.value
      )
      }

    onButtonClick ()
      {
      /* Needs to open the modal dialog box,
       so that info needs to be in a store
       so I can change it via an action
       (since it's in a separate component)
       */
      paneActions.openModalDialogBox({
        blockName    : this.props.blockName,
        attributeName: this.props.attributeName,
        message      : this.props.blockAttributeStatus.message
      });
      }

    render ()
      {

      /* Decide which icon to display,
       go through the 'alarm' subattribute
       and also look at the websocket success
       or fail somehow too
       */

      let statusIcon = null;

      if (this.props.blockAttribute.alarm !== undefined)
        {
        if (this.props.blockAttribute.alarm.message === 'Invalid')
          {
          console.log('widgetStatusIcon.render(): alarm: Invalid');
          statusIcon = <i className={"fa fa-plug fa-lg"} aria-hidden={"true"}
                          onClick={this.onButtonClick}></i>
          }
        //else {
        //  statusIcon = <i className="fa fa-info-circle fa-2x" aria-hidden="true"
        //                  onClick={this.onButtonClick}></i>
        //}
        }
      //else {
      //  statusIcon = <i className="fa fa-info-circle fa-2x" aria-hidden="true"
      //                  onClick={this.onButtonClick}></i>
      //}
      if (this.props.blockAttributeStatus !== undefined)
        {
        if (this.props.blockAttributeStatus.value === 'failure')
          {
          /* Override the other icons and display an error icon */
          console.log('widgetStatusIcon.render(): value === failure');

          statusIcon = <i className={"fa fa-exclamation-circle fa-lg"} aria-hidden={"true"}
                          onClick={this.onButtonClick}
                          style={{color: 'red'}}></i>


          }
        else if (this.props.blockAttributeStatus.value === 'pending')
          {
          /* Show spinny cog icon */
          console.log('widgetStatusIcon.render(): value === pending');

          statusIcon = <i className="fa fa-cog fa-spin fa-lg fa-fw margin-bottom"
                          onClick={this.onButtonClick}></i>

          }
        }

      /* All the info seems to be getting to the component fine,
       so I'm not sure where the error with MALCOLM_PENDING is
       occurring to cause the spinny cog to not display briefly?
       */

      /* UPDATE: tested by putting the MalcolmUtils call in
       MalcolmActionCreators in a setTimeout function, it appears,
       so it must be that the response comes back really quick
       so the cog isn't displayed for very long
       */

      if (statusIcon === null)
        {
        console.log('widgetStatusIcon.render(): statusIcon === null');
        statusIcon = <i className={"fa fa-info-circle fa-lg"} aria-hidden={"true"}
                        style={{cursor: 'pointer'}}
                        onClick={this.onButtonClick}></i>
        }

      return (
        statusIcon
      )
      }

  }

WidgetStatusIcon.propTypes = {
blockAttribute      : PropTypes.object,
  blockAttributeStatus: PropTypes.object,
  blockName           : PropTypes.string,
  attributeName       : PropTypes.string
};
