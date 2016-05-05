/**
 * Created by twi18192 on 04/05/16.
 */

var React = require('react');

var ReactPanels = require('react-panels');
var Content = ReactPanels.Content;

var Treeview = require('react-treeview');

var blockStore = require('../stores/blockStore');
var attributeStore = require('../stores/attributeStore');
/* Purely for favContent & configContent */
var paneStore = require('../stores/paneStore');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var WidgetTableContainer = require('./widgetTableContainer');

function getSidePaneTabContentsState(){
  return{
    allBlockAttributes: attributeStore.getAllBlockAttributes(),
    allBlockAttributesIconStatus: attributeStore.getAllBlockAttributesIconStatus(),
    favContent: paneStore.getFavContent(),
    configContent: paneStore.getConfigContent()
  }
}

var SidePaneTabContents = React.createClass({

  getInitialState: function(){
    return getSidePaneTabContentsState();
  },

  componentDidMount: function(){
    attributeStore.addChangeListener(this._onChange);
    paneStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    attributeStore.removeChangeListener(this._onChange);
    paneStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(getSidePaneTabContentsState());
  },

  handleMalcolmCall: function(blockName, method, args){
    console.log("malcolmCall in sidePane");
    MalcolmActionCreators.malcolmCall(blockName, method, args)
  },

  handleOnBlur: function(e){

    var inputFieldValue;
    var inputFieldElement = e.target;
    var inputFieldBlockName = e.target.className.slice(0, e.target.className.indexOf('widget'));

    var inputFieldAttribute = e.target.id.slice(inputFieldBlockName.length,
      e.target.id.indexOf('inputField'));

    if(inputFieldElement.value === ""){
      /* Set the value to 0, then send that to
       malcolmCall
       */

      inputFieldElement.value = "0";
      /* Had to use dot notation to set value, rather
       than setAttribute
       */

      inputFieldValue = "0";

    }
    else{
      //window.alert(inputFieldElement.value);
      inputFieldValue = inputFieldElement.value;
    }

    /* Now i need to pass malcolmCall the corresponding
     method and arguments
     */

    var inputFieldSetMethodName = "_set_" +inputFieldAttribute;

    var argsObject = {

    };

    argsObject[inputFieldAttribute] = inputFieldValue;

    this.handleMalcolmCall(inputFieldBlockName, inputFieldSetMethodName, argsObject);

    inputFieldElement.removeEventListener('blur', this.handleOnBlur);
  },

  handleEdgeDeleteButton: function(EdgeInfo){

    var methodName = "_set_" + EdgeInfo.toBlockPort;
    var argsObject = {};
    var argumentValue;

    /* Need to know the type of the port value,
     so a get from blockStore may be in order
     */

    for(var i = 0; i < blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports.length;
        i++){
      console.log(blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports[i].connectedTo);
      if(blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports[i].connectedTo !== null &&
        blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports[i].connectedTo.block === EdgeInfo.fromBlock &&
        blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports[i].connectedTo.port === EdgeInfo.fromBlockPort){
        if(blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports[i].type === 'bit'){
          argumentValue = 'BITS.ZERO';
        }
        else if(blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports[i].type == 'pos'){
          argumentValue = 'POSITIONS.ZERO';
        }
      }
    }

    argsObject[EdgeInfo.toBlockPort] = argumentValue;

    this.handleMalcolmCall(EdgeInfo.toBlock, methodName, argsObject);

  },

  attributeFieldOnChange: function(blockInfo, e){
    console.log("field changed, wait for the enter key?");
    console.log(e);
    console.log(blockInfo);
    //window.alert("fieldOnChange");

    var blockAttributeInputField = document.getElementById(blockInfo.block + blockInfo.attribute + "inputField");

    blockAttributeInputField.addEventListener('blur', this.handleOnBlur);

  },

  selectedInputFieldText: function(inputFieldElementName, e){

    var inputFieldElement = document.getElementById(inputFieldElementName);
    inputFieldElement.setSelectionRange(0, inputFieldElement.value.length);

  },

  onChangeBlockMethodDropdownOption: function(blockInfo, e){
    console.log("onClickBlockMethodDropdownOption");
    console.log(e);
    console.log(e.currentTarget.value);
    console.log(blockInfo);

    /* Fairly similar to the code for pressing
     enter for theeditable fields
     */
    var clickedOptionFromDropdownMenu = e.currentTarget.value;

    /* Testing 'VISIBLE' vs 'visible' for individual
     block tabs' visibility dropdowns
     */

    var blockAttribute;

    if(blockInfo.attribute === 'VISIBLE'){
      blockAttribute = 'visible';
    }
    else{
      blockAttribute = blockInfo.attribute;
    }

    var inputFieldSetMethodName = "_set_" + blockAttribute;
    var argsObject = {};

    for (var key in blockInfo) {
      if (blockInfo[key] === blockInfo.attribute) {
        argsObject[blockInfo.attribute] = clickedOptionFromDropdownMenu;
      }
    }

    this.handleMalcolmCall(blockInfo.block, inputFieldSetMethodName, argsObject);

  },

  toggleSwitch: function(blockName, attribute, toggleOrientation, e){
    console.log(toggleOrientation);
    console.log(blockName);

    var methodToInvoke;

    /* Check the blockName if it's VISIBILITY or not */

    if(blockName === 'VISIBILITY'){
      /* WHat may cause some confusion is that in the context
       of VISIBILITY, the name of a block is one of its attributes,
       but in the context of a block its attributes will be
       inputs, outputs, parameters etc
       */
      methodToInvoke = '_set_' + attribute + '_visible';
      console.log("in visibility");
    }
    else{
      if(attribute === 'VISIBLE'){
        methodToInvoke = '_set_' + attribute.toLowerCase();
      }
      else{
        methodToInvoke = '_set_' + attribute;
      }
    }

    /* invoke malcolmCall to toggle the visible attribute
     of the given block
     */

    /* If I'm toggling, I want to pass the OPPOSITE of
     whatever the current value of the toggle is
     */

    var newValue;
    var argsObject = {};

    if(typeof toggleOrientation === 'string') {
      if (toggleOrientation === 'Show') {
        newValue = 'Hide';
      }
      else if (toggleOrientation === 'Hide') {
        newValue = 'Show'
      }
    }
    else if(typeof toggleOrientation === 'boolean'){
      newValue = !toggleOrientation;
    }

    argsObject[attribute] = newValue;

    console.log(newValue);

    /* Now invoke malcolmCall */

    this.handleMalcolmCall(blockName, methodToInvoke, argsObject);

    /* Should also close the tab if I'm hiding a block maybe? */

  },

  generateTabContent: function(blockAttributes, blockName){

    var blockAttributeDivs = [];

    var groupsObject = {};

    for(var attribute in blockAttributes){

      if(blockAttributes[attribute].tags === undefined &&
        blockAttributes[attribute].alarm === undefined){

        /* Creating the array that I'll push the
         treeview children to as the upper for loop
         goes through all the attributes of the block
         */
        groupsObject[attribute] = [];

      }
      else if(blockAttributes[attribute].tags !== undefined){

        var isWidget = false;
        var widgetType;
        var isInAGroup = false;
        var widgetParent;

        for(var k = 0; k < blockAttributes[attribute].tags.length; k++){
          if(blockAttributes[attribute].tags[k].indexOf('widget') !== -1){
            isWidget = true;
            widgetType = blockAttributes[attribute].tags[k].slice('widget:'.length);
          }

          /* Need to find what group the
           attribute belongs to as well
           */

          else if(blockAttributes[attribute].tags[k].indexOf('group') !== -1 ){

            isInAGroup = true;
            var groupName = blockAttributes[attribute].tags[k].slice('group:'.length);

          }
        }

        if(isWidget === true){

          /* Want a switch statement going through all
           the possible widget types
           */

          /* Also want to take into account whether or
           not the widget is part of a group, so do a check
           on isInAGroup with some sort of logic to decided
           what to 'push' to in each case
           */

          if(isInAGroup === true){
            widgetParent = groupsObject[groupName];
          }
          else if(isInAGroup === false){
            widgetParent = blockAttributeDivs;
          }

          /* Using JSX spread attributes to pass a common set
           of props to all widgets
           */

          var commonProps = {
            blockAttribute: blockAttributes[attribute],
            blockAttributeStatus: this.state.allBlockAttributesIconStatus[blockName][attribute],
            blockName: blockName,
            attributeName: attribute,
            isInAGroup: isInAGroup,
            key: blockName + attribute + widgetType,
            widgetType: widgetType
          };

          switch(widgetType){

            case 'led':
            case 'textupdate':
              widgetParent.push(
                <WidgetTableContainer {...commonProps} />
              );
              break;

            case 'textinput':
              widgetParent.push(
                <WidgetTableContainer {...commonProps}
                  attributeFieldOnChange={this.attributeFieldOnChange}
                  selectedInputFieldText={this.selectedInputFieldText} />
              );
              break;

            case 'choice':
            case 'combo':
              widgetParent.push(
                <WidgetTableContainer {...commonProps}
                  onChangeBlockMethodDropdownOption={
                                            this.onChangeBlockMethodDropdownOption
                                            } />
              );
              break;

            case 'toggle':
              widgetParent.push(
                <WidgetTableContainer {...commonProps}
                  toggleSwitch={this.toggleSwitch} />
              );
              break;

          }
        }

      }

      /* Then here have a for loop iterating through
       the groupsObject, creating a treeview for each
       one, then handing it a nodeLabel and its child
       array with all the appropriate children
       */

    }

    for(var group in groupsObject){
      blockAttributeDivs.push(
        <Treeview defaultCollapsed={true}
                  nodeLabel={
                    <b style={{marginLeft: '-47px', fontSize: '13px'}}>{group}</b>
                    }
                  key={group + 'treeview'}
        > {groupsObject[group]}
        </Treeview>
      )
    }

    return blockAttributeDivs;

  },

  render: function(){

    var tabContent = [];

    if(this.props.tabObject.tabType === "Favourites"){
      tabContent.push(
        <p>{this.state.favContent.name}</p>
      );
    }
    else if(this.props.tabObject.tabType === 'Configuration'){
      tabContent.push(
        <p>{this.state.configContent.name}</p>
      );
    }
    else if(this.props.tabObject.tabType === 'VISIBILITY'){

      /* Making the tab content generator more generic */

      tabContent.push(
        this.generateTabContent(this.state.allBlockAttributes[this.props.tabObject.label],
          this.props.tabObject.label)
      );
    }
    else if(this.props.tabObject.tabType === 'edge'){

      tabContent.push(
        <button key={this.props.tabObject.label + "edgeDeleteButton"}
                onClick={this.handleEdgeDeleteButton.bind(null, this.props.tabObject)}
        >Delete edge</button>
      );
    }
    else if(this.props.tabObject.tabType === 'block'){
      tabContent.push(
        this.generateTabContent(this.state.allBlockAttributes[this.props.tabObject.label],
          this.props.tabObject.label)
      );
    }

    return(
      <Content>
        {tabContent}
      </Content>
    )
  }

});

module.exports = SidePaneTabContents;
