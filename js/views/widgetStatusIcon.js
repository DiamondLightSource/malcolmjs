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
    return(
      <button style={this.props.iconStyling}
              onClick={this.onButtonClick} >
        Icon
      </button>
    )
  }

});

module.exports = WidgetStatusIcon;
