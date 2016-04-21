/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var WidgetStatusIcon = require('./widgetStatusIcon');

var DropdownEditableReadoutField = React.createClass({

  render: function(){

    var dropdownOptions = [];

    for(var m = 0; m < this.props.blockAttribute.type.labels.length; m++){
      /* Check which option needs to be selected
       on initial render by checking the value
       from the server?
       */

      //if(this.props.blockAttribute.type.labels[m] ===
      //  this.props.blockAttribute.value){
      //  dropdownOptions.push(
      //    <option value={this.props.blockAttribute.type.labels[m]}
      //            selected="selected"
      //            key={this.props.blockAttribute.type.labels[m] + 'dropdownOption'}  >
      //      {this.props.blockAttribute.type.labels[m]}
      //    </option>
      //  )
      //}
      //else {
      //  dropdownOptions.push(
      //    <option value={this.props.blockAttribute.type.labels[m]}
      //            key={this.props.blockAttribute.type.labels[m] + 'dropdownOption'}
      //    >
      //      {this.props.blockAttribute.type.labels[m]}
      //    </option>
      //  )
      //}

      /* Try using the value attribute of <select>,
      rather than setting selected on an <option>
       */

      dropdownOptions.push(
        <option value={this.props.blockAttribute.type.labels[m]}
                key={this.props.blockAttribute.type.labels[m] + 'dropdownOption'}
        >
          {this.props.blockAttribute.type.labels[m]}
        </option>
      )

    }

    var dropdownList =
      <select onChange={this.props.onChangeBlockMethodDropdownOption.bind(null, {
                            block: this.props.blockName,
                            attribute: this.props.attributeName
                            })}
              style={{width: '152px'}}
              value={this.props.blockAttribute.value} >
        {dropdownOptions}
      </select>;

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
              {dropdownList}
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

module.exports = DropdownEditableReadoutField;
