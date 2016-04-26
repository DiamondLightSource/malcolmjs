/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var WidgetStatusIcon = require('./widgetStatusIcon');

var NonEditableReadoutField = React.createClass({

  onClick: function(e){
    e.preventDefault();
    //e.target.blur();
  },

  render: function(){
    return(
      <table id={this.props.blockName + this.props.attributeName + 'contentTable'}
             style={{width: '350px', tableLayout: 'fixed'}} >
        <tbody>
          <tr style={{verticalAlign: 'middle'}} >
            <td style={{width: this.props.isInAGroup === true ? '170px' : '180px'}} >
              <p style={{margin: '0px'}}>
                {String(this.props.attributeName)}
              </p>
            </td>
            <td style={{width: '150px'}} >
              <input id={this.props.blockName + this.props.attributeName + "readoutField"}
                     className="readoutField"
                     value={String(this.props.blockAttribute.value)}
                     style={{textAlign: 'left', borderRadius: '4px',
                             border: '2px solid #797979',
                             color: 'lightblue', backgroundColor:'#3e3e3e',
                             cursor: 'default'}}
                     onMouseDown={this.onClick}
                     onMouseUp={this.onClick}
                     onMouseOut={this.onClick}
                     readOnly="true"
                     maxLength="16" size="16"/>
            </td>
            <td style={{width: '30px', textAlign: 'center'}} >
              <WidgetStatusIcon blockName={this.props.blockName}
                                attributeName={this.props.attributeName}
                                blockAttribute={this.props.blockAttribute}
                                blockAttributeStatus={this.props.blockAttributeStatus}/>
            </td>
          </tr>
        </tbody>
      </table>

    )
  }

});

module.exports = NonEditableReadoutField;


//<div style={{backgroundColor: 'black', borderRadius: '2px'}} >
//  <b style={{color: 'cyan'}} >
//    {String(this.props.blockAttribute.value)}
//  </b>
//</div>
