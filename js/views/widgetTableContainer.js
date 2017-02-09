/**
 * Created by twi18192 on 27/04/16.
 */

let React = require('react');

let NonEditableReadoutField      = require('./nonEditableReadoutField');
let TextEditableReadoutField     = require('./textEditableReadoutField');
let DropdownEditableReadoutField = require('./dropdownEditableReadoutField');
let LEDWidget                    = require('./ledWidget');
let BlockToggleSwitch            = require('./blockToggleSwitch');
//let BlockToggleSwitch            = require('../../components/blockToggleSwitchBelle');

let WidgetStatusIcon = require('./widgetStatusIcon');

let WidgetTableContainer = React.createClass({

  propTypes: {
    blockAttribute      : React.PropTypes.object,
    blockAttributeStatus: React.PropTypes.object,
    blockName           : React.PropTypes.string,
    attributeName       : React.PropTypes.string,
    widgetType          : React.PropTypes.string,
    isInAGroup          : React.PropTypes.bool
  },

  shouldComponentUpdate: function (nextProps, nextState)
    {
    let valcheck    = (nextProps.blockAttribute.value !== this.props.blockAttribute.value);
    let statusCheck = false;
    if ((nextProps.blockAttributeStatus !== undefined) && (this.props.blockAttributeStatus !== undefined))
      statusCheck = nextProps.blockAttributeStatus.value !== this.props.blockAttributeStatus.value;

    return (valcheck || statusCheck)
    },

  render: function ()
    {

    let widget;
    let commonProps = {
      blockName    : this.props.blockName,
      attributeName: this.props.attributeName
    };

    switch (this.props.widgetType)
    {

      case 'led':
        widget =
          <LEDWidget {...commonProps}
                     blockAttributeValue={this.props.blockAttribute.value}/>;
        break;

      case 'textupdate':
        widget =
          <NonEditableReadoutField {...commonProps}
                                   blockAttributeValue={this.props.blockAttribute.value}/>;
        break;

      case 'textinput':
        widget =
          <TextEditableReadoutField {...commonProps}
                                    blockAttributeValue={this.props.blockAttribute.value}/>;
        break;

      case 'choice':
      case 'combo':
        widget =
          <DropdownEditableReadoutField {...commonProps}
                                        blockAttribute={this.props.blockAttribute}/>;
        break;

      case 'toggle':
        widget =
          <BlockToggleSwitch {...commonProps}
                             blockAttributeValue={this.props.blockAttribute.value}/>;
        break;

    }

    return (
      <table id={this.props.blockName + this.props.attributeName + 'contentTable'}
             style={{width: '350px', tableLayout: 'fixed'}}>
        <tbody>
        <tr style={{verticalAlign: 'middle'}}>
          <td style={{width: this.props.isInAGroup === true ? '170px' : '180px'}}>
            <p style={{margin: '0px'}}>
              {String(this.props.attributeName)}
            </p>
          </td>

          <td style={{width: '150px'}}>
            {widget}
          </td>

          <td style={{width: '30px', textAlign: 'center'}}>
            <WidgetStatusIcon {...commonProps}
                              blockAttribute={this.props.blockAttribute}
                              blockAttributeStatus={this.props.blockAttributeStatus}/>
          </td>
        </tr>
        </tbody>
      </table>
    )
    }

});

module.exports = WidgetTableContainer;
