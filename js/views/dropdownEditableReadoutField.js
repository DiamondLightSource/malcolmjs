/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var DropdownEditableReadoutField = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttribute !== this.props.blockAttribute ||
      nextProps.blockAttributeStatus !== this.props.blockAttributeStatus ||
      nextProps.blockName !== this.props.blockName ||
      nextProps.attributeName !== this.props.attributeName
    )
  },

  render: function(){

    var dropdownOptions = [];

    for(var m = 0; m < this.props.blockAttribute.type.labels.length; m++){

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
              className="dropdownMenuWidget"
              style={{width: '152px', backgroundColor:'#333333', color: 'lightblue',
                      borderRadius: '4px', border: '2px solid #202020'}}
              value={this.props.blockAttribute.value} >
        {dropdownOptions}
      </select>;

    return(
      dropdownList
    )
  }

});

module.exports = DropdownEditableReadoutField;
