/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var DropdownEditableReadoutField = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttribute.value !== this.props.blockAttribute.value
    )
  },

  handleMalcolmCall: function(blockName, method, args){
    console.log("malcolmCall in sidePane");
    MalcolmActionCreators.malcolmCall(blockName, method, args)
  },

  handleDropdownOptionChange: function(e){

    var clickedOptionFromDropdownMenu = e.currentTarget.value;

    /* Testing 'VISIBLE' vs 'visible' for individual
     block tabs' visibility dropdowns
     */

    var blockAttribute;

    if(this.props.attributeName === 'VISIBLE'){
      blockAttribute = 'visible';
    }
    else{
      blockAttribute = this.props.attributeName;
    }

    var inputFieldSetMethodName = "_set_" + blockAttribute;
    var argsObject = {};

    argsObject[this.props.attributeName] = clickedOptionFromDropdownMenu;

    this.handleMalcolmCall(this.props.blockName, inputFieldSetMethodName, argsObject);

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
      <select onChange={this.handleDropdownOptionChange}
              className="dropdownMenuWidget"
              value={this.props.blockAttribute.value} >
        {dropdownOptions}
      </select>;

    return(
      dropdownList
    )
  }

});

module.exports = DropdownEditableReadoutField;
