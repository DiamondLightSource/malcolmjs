/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var WidgetStatusIcon = require('./widgetStatusIcon');

var NonEditableReadoutField = React.createClass({

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
              <div style={{backgroundColor: 'black', borderRadius: '2px'}} >
                <b style={{color: 'cyan'}} >
                  {String(this.props.blockAttribute.value)}
                </b>
              </div>
            </td>
            <td style={{width: '30px', textAlign: 'center'}} >
              <WidgetStatusIcon blockName={this.props.blockName}
                                attributeName={this.props.attributeName}
                                blockAttribute={this.props.blockAttribute} />
            </td>
          </tr>
        </tbody>
      </table>

    )
  }

});

module.exports = NonEditableReadoutField;
