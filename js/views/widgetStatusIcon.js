/**
 * Created by twi18192 on 18/04/16.
 */

var React = require('react');

var paneActions = require('../actions/paneActions');

var WidgetStatusIcon = React.createClass({

  onButtonClick: function(){
    /* Needs to open the modal dialog box,
    so that info needs to be in a store
    so I can change it via an action
    (since it's in a separate component)
     */
    paneActions.openModalDialogBox({
      blockName: this.props.blockName,
      attributeName: this.props.attributeName
    });
  },

  render: function(){

    /* Decide which icon to display,
    go through the 'alarm' subattribute
    and also look at the websocket success
    or fail somehow too
     */

    var statusIcon;

    if(this.props.blockAttribute.alarm !== undefined){
      if (this.props.blockAttribute.alarm.message === 'Invalid') {
        statusIcon = <i className="fa fa-plug fa-2x" aria-hidden="true"
                        onClick={this.onButtonClick}></i>
      }
      else {
        statusIcon = <i className="fa fa-info-circle fa-2x" aria-hidden="true"
                        onClick={this.onButtonClick}></i>
      }
    }
    else {
      statusIcon = <i className="fa fa-info-circle fa-2x" aria-hidden="true"
                      onClick={this.onButtonClick}></i>
    }

    return(
      statusIcon
    )
  }

});

module.exports = WidgetStatusIcon;
