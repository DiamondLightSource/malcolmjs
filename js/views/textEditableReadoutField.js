/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var TextEditableReadoutField = React.createClass({

  render: function(){
    return(
      <div style={{position: 'relative', left: '20',
                   bottom: '0px', width: '230px', height: '25px'}}>
        <p key={this.props.blockName + this.props.attributeName + "textContent"}
           id={this.props.blockName + this.props.attributeName + "textContent"}
           style={{fontSize: '13px', position: 'relative'}}>
          {String(this.props.attributeName)}
        </p>
        <div style={{position: 'relative', bottom: '35px', left: '90px'}}>
          <button style={{position: 'relative', left: '215px',}}>Icon</button>
          <input id={this.props.blockName + this.props.attributeName + "inputField"}
                 style={{position: 'relative', textAlign: 'left',
                         borderRadius: '2px', border: '2px solid #999',
                            //contentEditable:"true"
                            color: 'blue'}}
                 defaultValue={String(this.props.blockAttribute.value)} /* pass the specific block attribute to each readout! */
                 onChange={this.props.attributeFieldOnChange.bind(null, {
                            block: this.props.blockName,
                            attribute: this.props.attributeName
                            })}
                 onClick={this.props.selectedInputFieldText.bind(null,
                 this.props.blockName + this.props.attributeName + "inputField")}
                 maxLength="17" size="17"/>
        </div>
      </div>
    )
  }

});

module.exports = TextEditableReadoutField;
