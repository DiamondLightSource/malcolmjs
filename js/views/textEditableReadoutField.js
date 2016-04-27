/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var TextEditableReadoutField = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttribute !== this.props.blockAttribute ||
      nextProps.blockAttributeStatus !== this.props.blockAttributeStatus ||
      nextProps.blockName !== this.props.blockName ||
      nextProps.attributeName !== this.props.attributeName
    )
  },

  componentDidMount: function(){
    document.getElementById(this.props.blockName
      + this.props.attributeName + "inputField")
      .addEventListener('keyup', this.enterKeyUp);
  },

  enterKeyUp: function(e){
    if(e.keyCode === 13){
      document.getElementById(this.props.blockName
        + this.props.attributeName + "inputField").blur();
    }
  },

  render: function(){
    return(

      <input id={this.props.blockName + this.props.attributeName + "inputField"}
             className={this.props.blockName + 'widget'}
             style={{textAlign: 'left', borderRadius: '4px',
                     border: '2px solid #202020',
                        //contentEditable:"true"
                     color: 'lightblue', backgroundColor:'#333333'}}
             defaultValue={String(this.props.blockAttribute.value)}
             onChange={this.props.attributeFieldOnChange.bind(null, {
                        block: this.props.blockName,
                        attribute: this.props.attributeName
                        })}
             onClick={this.props.selectedInputFieldText.bind(null,
             this.props.blockName + this.props.attributeName + "inputField")}
             maxLength="16" size="16"/>


    )
  }

});

module.exports = TextEditableReadoutField;
