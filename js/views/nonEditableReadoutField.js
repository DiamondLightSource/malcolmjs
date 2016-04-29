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
             className="readoutField"
             value={String(this.props.blockAttributeValue)}
             style={{textAlign: 'left', borderRadius: '4px',
                     border: '2px solid #797979',
                     color: 'lightblue', backgroundColor:'#3e3e3e',
                     cursor: 'default'}}
             onMouseDown={this.onClick}
             onMouseUp={this.onClick}
             onMouseOut={this.onClick}
             readOnly="true"
             maxLength="16" size="16"/>

    )
  }

});

module.exports = NonEditableReadoutField;
