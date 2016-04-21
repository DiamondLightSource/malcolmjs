/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var WidgetStatusIcon = require('./widgetStatusIcon');

var TextEditableReadoutField = React.createClass({

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

      <table id={this.props.blockName + this.props.attributeName + 'contentTable'}
             style={{width: '350px', tableLayout: 'fixed'}} >
        <tbody>
          <tr style={{verticalAlign: 'middle'}} >
            <td style={{width: '180px'}} >
              <p style={{margin: '0px'}}>
                {String(this.props.attributeName)}
              </p>
            </td>
            <td style={{width: '150px'}} >
              <input id={this.props.blockName + this.props.attributeName + "inputField"}
                     className={this.props.blockName + 'widget'}
                     style={{textAlign: 'left',borderRadius: '2px', border: '2px solid #999',
                                //contentEditable:"true"
                                color: 'blue'}}
                     defaultValue={String(this.props.blockAttribute.value)}
                     onChange={this.props.attributeFieldOnChange.bind(null, {
                                block: this.props.blockName,
                                attribute: this.props.attributeName
                                })}
                     onClick={this.props.selectedInputFieldText.bind(null,
                     this.props.blockName + this.props.attributeName + "inputField")}
                     maxLength="16" size="16"/>
            </td>
            <td style={{width: '30px', textAlign: 'center'}} >
              <WidgetStatusIcon blockName={this.props.blockName}
                                attributeName={this.props.attributeName}
                                blockAttribute={this.props.blockAttribute}
                                blockAttributeStatus={this.props.blockAttributeStatus} />
            </td>
          </tr>
        </tbody>
      </table>

    )
  }

});

module.exports = TextEditableReadoutField;
