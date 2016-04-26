/**
 * Created by twi18192 on 06/04/16.
 */

var React = require('react');

var WidgetStatusIcon = require('./widgetStatusIcon');

var LEDWidget = React.createClass({
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
            <svg style={{width: '150', height: '20'}}  >
              <circle r="8" style={{fill: this.props.blockAttribute.value ? 'orange' : 'lightblue',
                                stroke: 'white' }}
                            transform="translate(9, 11)" />
            </svg>
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

module.exports = LEDWidget;
