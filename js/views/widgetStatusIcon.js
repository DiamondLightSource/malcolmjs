/**
 * Created by twi18192 on 18/04/16.
 */

var React = require('react');

var paneActions = require('../actions/paneActions');

var WidgetStatusIcon = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttribute !== this.props.blockAttribute ||
      nextProps.blockAttributeStatus !== this.props.blockAttributeStatus ||
      nextProps.blockName !== this.props.blockName ||
      nextProps.attributeName !== this.props.attributeName
    )
  },

  onButtonClick: function(){
    /* Needs to open the modal dialog box,
    so that info needs to be in a store
    so I can change it via an action
    (since it's in a separate component)
     */
    paneActions.openModalDialogBox({
      blockName: this.props.blockName,
      attributeName: this.props.attributeName,
      message: this.props.blockAttributeStatus.message
    });
  },

  render: function(){

    /* Decide which icon to display,
    go through the 'alarm' subattribute
    and also look at the websocket success
    or fail somehow too
     */

    var statusIcon = null;

    if(this.props.blockAttribute.alarm !== undefined){
      if (this.props.blockAttribute.alarm.message === 'Invalid') {
        statusIcon = <i className="fa fa-plug fa-lg" aria-hidden="true"
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

    if(this.props.blockAttributeStatus.value === 'failure'){
      /* Override the other icons and display an error icon */

      statusIcon = <i className="fa fa-exclamation-circle fa-lg" aria-hidden="true"
                      onClick={this.onButtonClick}
                      style={{color: 'red'}} ></i>


    }
    else if(this.props.blockAttributeStatus.value === 'pending'){
      /* Show spinny cog icon */

      statusIcon = <i className="fa fa-cog fa-spin fa-lg fa-fw margin-bottom"
                      onClick={this.onButtonClick}></i>

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

    if(statusIcon === null){

      statusIcon = <i className="fa fa-info-circle fa-lg" aria-hidden="true"
                      style={{cursor: 'pointer'}}
                      onClick={this.onButtonClick}></i>
    }

    return(
      statusIcon
    )
  }

});

module.exports = WidgetStatusIcon;
