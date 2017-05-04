/**
 * Created by twi18192 on 27/04/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

import NonEditableReadoutField      from './nonEditableReadoutField';
import TextEditableReadoutField     from './textEditableReadoutField';
import DropdownEditableReadoutField from './dropdownEditableReadoutField';
import LEDWidget                    from './ledWidget';
import BlockToggleSwitch            from './blockToggleSwitch';
//import BlockToggleSwitch            from '../../components/blockToggleSwitchBelle';
import WidgetStatusIcon from './widgetStatusIcon';

export default class WidgetTableContainer extends React.Component
{
  constructor(props)
    {
    super(props);
    }


  shouldComponentUpdate (nextProps, nextState)
    {
    let valcheck    = (nextProps.blockAttribute.value !== this.props.blockAttribute.value);
    let statusCheck = false;
    if ((nextProps.blockAttributeStatus !== undefined) && (this.props.blockAttributeStatus !== undefined))
      statusCheck = nextProps.blockAttributeStatus.value !== this.props.blockAttributeStatus.value;

    return (valcheck || statusCheck)
    }

  render ()
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
                                   blockAttributeValue={this.props.blockAttribute.value.toString()}/>;
        break;

      case 'textinput':
        widget =
          <TextEditableReadoutField {...commonProps}
                                    blockAttributeValue={this.props.blockAttribute.value.toString()}/>;
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
                             blockAttributeValue={this.props.blockAttribute.value.toString()}/>;
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
}

WidgetStatusIcon.propTypes = {
blockAttribute      : PropTypes.object,
  blockAttributeStatus: PropTypes.object,
  blockName           : PropTypes.string,
  attributeName       : PropTypes.string,
  widgetType          : PropTypes.string,
  isInAGroup          : PropTypes.bool
};
