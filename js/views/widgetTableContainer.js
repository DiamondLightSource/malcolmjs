/**
 * Created by twi18192 on 27/04/16.
 */

var React = require('react');

var NonEditableReadoutField = require('./nonEditableReadoutField');
var TextEditableReadoutField = require('./textEditableReadoutField');
var DropdownEditableReadoutField = require('./dropdownEditableReadoutField');
var LEDWidget = require('./ledWidget');
var BlockToggleSwitch = require('./blockToggleSwitch');

var WidgetStatusIcon = require('./widgetStatusIcon');

var WidgetTableContainer = React.createClass({

    shouldComponentUpdate: function (nextProps, nextState) {
        return (
            nextProps.blockAttribute.value !== this.props.blockAttribute.value ||
            nextProps.blockAttributeStatus.value !== this.props.blockAttributeStatus.value
        )
    },

    render: function () {

        var widget;
        var commonProps = {
            blockName: this.props.blockName,
            attributeName: this.props.attributeName
        };

        switch (this.props.widgetType) {

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
