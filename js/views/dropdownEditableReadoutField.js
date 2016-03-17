/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var DropdownEditableReadoutField = React.createClass({

  render: function(){

    var dropdownOptions = [];

    for(var m = 0; m < this.props.blockAttribute.type.labels.length; m++){
      /* Check which option needs to be selected
       on initial render by checking the value
       from the server?
       */

      if(this.props.blockAttribute.type.labels[m] ===
        this.props.blockAttribute.value){
        dropdownOptions.push(
          <option value={this.props.blockAttribute.type.labels[m]}
                  selected="selected" >
            {this.props.blockAttribute.type.labels[m]}
          </option>
        )
      }
      else {
        dropdownOptions.push(
          <option value={this.props.blockAttribute.type.labels[m]}
          >
            {this.props.blockAttribute.type.labels[m]}
          </option>
        )
      }
    }

    var dropdownList =
      <select onChange={this.props.onChangeBlockMethodDropdownOption.bind(null, {
                            block: this.props.blockName,
                            attribute: this.props.attributeName
                            })}
              style={{width: '160px'}} >
        {dropdownOptions}
      </select>;

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
          {dropdownList}
        </div>
      </div>
    )
  }

});

module.exports = DropdownEditableReadoutField;
