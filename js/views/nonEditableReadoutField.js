/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var NonEditableReadoutField = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttributeValue !== this.props.blockAttributeValue
    )
  },

  onClick: function(e){
    e.preventDefault();
    //e.target.blur();
  },

  render: function(){
    return(

      <input id={this.props.blockName + this.props.attributeName + "readoutField"}
             className="readoutFieldWidget"
             value={String(this.props.blockAttributeValue)}
             onMouseDown={this.onClick}
             onMouseUp={this.onClick}
             onMouseOut={this.onClick}
             readOnly="true" />

    )
  }

});

module.exports = NonEditableReadoutField;
