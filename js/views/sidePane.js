/**
 * Created by twi18192 on 01/09/15.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var ReactPanels = require('react-panels');
var Dropdown = require('./dropdownMenu');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;
var Button = ReactPanels.Button;

var paneStore = require('../stores/paneStore');
var paneActions = require('../actions/paneActions');

var Treeview = require('react-treeview');
var interact = require('../../node_modules/interact.js');

var blockActions = require('../actions/blockActions.js');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var CustomButton = require('./button');

var NonEditableReadoutField = require('./nonEditableReadoutField');
var TextEditableReadoutField = require('./textEditableReadoutField');
var DropdownEditableReadoutField = require('./dropdownEditableReadoutField');
var LEDWidget = require('./ledWidget');

var BlockToggleSwitch = require('./blockToggleSwitch');

var BlockToggle = require('react-toggle');

//var TreeviewComponent = require('react-treeview-component');

var blockStore = require('../stores/blockStore');

var SidePane = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return (
      nextProps.selectedTabIndex !== this.props.selectedTabIndex ||
      nextProps.listVisible !== this.props.listVisible ||
      nextProps.tabState !== this.props.tabState ||
      nextProps.allBlockInfo !== this.props.allBlockInfo ||
      nextProps.favContent !== this.props.favContent ||
      nextProps.configContent !== this.props.configContent ||
      nextProps.allBlockAttributes !== this.props.allBlockAttributes ||
      nextProps.blocksVisibility !== this.props.blocksVisibility
      //nextProps.blockPositions !== this.props.blockPositions
    )
  },

  handleActionPassSidePane: function(){
    paneActions.passSidePane(this)
  },

  handleActionAddTab: function(){
    paneActions.addTab("this is the item"); /* this is what the plus button should invoke when clicked */
  },

  handleActionRemoveTab: function(){
    var selectedIndex = this.refs.panel.getSelectedIndex();
    paneActions.removeTab(selectedIndex);
  },

  handleActionTabChangeViaOtherMeans: function(tab){
    console.log(tab);
    paneActions.dropdownMenuSelect(tab, this);
    console.log("action function for changing tab via other means ran correctly");
  },

  handleActionInitialFetchOfBlockData: function(){
    paneActions.initialFetchOfBlockDataFromBlockStore("fetch the initial block data!");
  },
  handleActionRemoveBlockTab: function(){
    var selectedIndex = this.refs.panel.getSelectedIndex();
    paneActions.removeBlockTab(selectedIndex);
  },

  handleEdgeDeleteButton: function(EdgeInfo){
    console.log(EdgeInfo);
    /* Replace with a malcolmCall to delete the edge */
    //blockActions.deleteEdge(EdgeInfo);

    var methodName = "_set_" + EdgeInfo.toBlockPort;
    var argsObject = {};
    var argumentValue;

    /* Need to know the type of the port value,
    so a get from blockStore may be in order
     */

    /* Can check either the fromPort value type,
    or the toPort value type, if the two ports
    are connected then they'll have the same type
     */

    for(var i = 0; i < blockStore.getAllBlockInfo()[EdgeInfo.fromBlock].outports.length;
      i++){
      if(blockStore.getAllBlockInfo()[EdgeInfo.fromBlock].outports[i].type === 'bit'){
        argumentValue = 'BITS.ZERO';
      }
      else if(blockStore.getAllBlockInfo()[EdgeInfo.fromBlock].outports[i].type === 'pos'){
        argumentValue = 'POSITIONS.ZERO';
      }
    }

    argsObject[EdgeInfo.toBlockPort] = argumentValue;

    this.handleMalcolmCall(EdgeInfo.toBlock, methodName, argsObject);

  },

  handleAttributeValueSubmit: function(blockName, method, args){
    MalcolmActionCreators(blockName, method, args);
  },

  componentDidMount: function(){
    this.handleActionPassSidePane();
    ReactDOM.findDOMNode(this).addEventListener('keydown', this.disableTabKey);
  },

  componentWillUnmount: function(){
  },

  toggleTreeviewContent: function(){

  },

  collapseAllTreeviews: function(){

  },

  selectedInputFieldText: function(inputFieldElementName, e){

    var inputFieldElement = document.getElementById(inputFieldElementName);
    inputFieldElement.setSelectionRange(0, inputFieldElement.value.length);

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

  attributeFieldOnChange: function(blockInfo, e){
    console.log("field changed, wait for the enter key?");
    console.log(e);
    console.log(blockInfo);
    //window.alert("fieldOnChange");

    var blockAttributeInputField = document.getElementById(blockInfo.block + blockInfo.attribute + "inputField");

    blockAttributeInputField.addEventListener('blur', this.handleOnBlur);

  },

  handleMalcolmCall: function(blockName, method, args){
    console.log("malcolmCall in sidePane");
    MalcolmActionCreators.malcolmCall(blockName, method, args)
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

  generateTabContent: function(blockAttributes, blockName){

    var blockAttributeDivs = [];

    var groupsObject = {};

    console.log(blockAttributes);
    console.log(blockName);

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

          switch(widgetType){

            case 'led':
                  widgetParent.push(
                    <LEDWidget blockAttribute={blockAttributes[attribute]}
                               blockName={blockName}
                               attributeName={attribute}
                               key={blockName + attribute + 'led'} />
                  );
                  break;

            case 'textupdate':
                  widgetParent.push(
                    <NonEditableReadoutField blockAttribute={blockAttributes[attribute]}
                                             blockName={blockName}
                                             attributeName={attribute}
                                             key={blockName + attribute + 'readonlyField'} />
                  );
                  break;

            case 'textinput':
              widgetParent.push(
                <TextEditableReadoutField blockAttribute={blockAttributes[attribute]}
                                          blockName={blockName}
                                          attributeName={attribute}
                                          attributeFieldOnChange={this.attributeFieldOnChange}
                                          selectedInputFieldText={this.selectedInputFieldText}
                                          key={blockName + attribute + 'textEditField'}  />
                  );
                  break;

            case 'choice':
              widgetParent.push(
                <DropdownEditableReadoutField blockAttribute={blockAttributes[attribute]}
                                              blockName={blockName}
                                              attributeName={attribute}
                                              onChangeBlockMethodDropdownOption={
                                            this.onChangeBlockMethodDropdownOption
                                            }
                                              key={blockName + attribute + 'dropdownField'}  />
                  );
                  break;

            case 'combo':
              widgetParent.push(
                <DropdownEditableReadoutField blockAttribute={blockAttributes[attribute]}
                                              blockName={blockName}
                                              attributeName={attribute}
                                              onChangeBlockMethodDropdownOption={
                                            this.onChangeBlockMethodDropdownOption
                                            }
                                              key={blockName + attribute + 'dropdownField'}  />
                  );
                  break;

            case 'toggle':
                  widgetParent.push(
                    <BlockToggleSwitch blockName={blockName}
                                       attribute={attribute}
                                       toggleSwitch={this.toggleSwitch}
                                       toggleOrientation={blockAttributes[attribute].value}
                                       key={blockName + attribute + 'toggleSwitch'}
                    />
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
                    <b style={{marginLeft: '-47px'}}>{group}</b>
                    }
                  key={group + 'treeview'}
        > {groupsObject[group]}
        </Treeview>
      )
    }

    return blockAttributeDivs;

  },

  disableTabKey: function(e){
    console.log(e);
    if(e.keyCode === 9){
      console.log("tab key!");
      e.preventDefault();
    }
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


  render: function () {

    console.log("render: sidePane");
    console.log(this.props.tabState);

    var skin = this.props.skin || "default",
      globals = this.props.globals || {};

    var betterTabs = this.props.tabState.map(function(block, i){

      var betterTabContent = function() {

        var tabContent = [];

        if(block.tabType === "Favourites"){
          tabContent.push(
            <p>{this.props.favContent.name}</p>
          );
        }
        else if(block.tabType === 'Configuration'){
          tabContent.push(
            <p>{this.props.configContent.name}</p>
          );
        }
        else if(block.tabType === 'BlockLookupTable'){

          /* Making the tab content generator more generic */

          tabContent.push(
            this.generateTabContent(this.props.blocksVisibility, 'VISIBILITY')
          );
        }
        else if(block.tabType === 'edge'){

          tabContent.push(
            <button key={block.label + "edgeDeleteButton"}
                    onClick={this.handleEdgeDeleteButton.bind(null, block)}
            >Delete edge</button>
          );
        }
        else if(block.tabType === 'block'){
          tabContent.push(this.generateTabContent(this.props.allBlockAttributes[block.label],
            block.label));
        }
        console.log(tabContent);
        return tabContent;
      }.bind(this);

      return (
        <Tab key={block.label + "tab"} title={block.label}>

          <Content key={block.label + "content"} >
            {betterTabContent()}
          </Content>

        </Tab>
      )
    }.bind(this));

    return (
        <Panel ref="panel" theme="flexbox" skin={skin} useAvailableHeight={true} globals={globals} buttons={[


            <Button title="Remove active tab" onButtonClick={this.handleActionRemoveBlockTab}>
              <i className="fa fa-times"></i>
            </Button>,
            <Button title="Drop down menu">
            <div id="dropDown"><Dropdown changeTab={this.handleActionTabChangeViaOtherMeans}
            tabState={this.props.tabState}
            listVisible={this.props.listVisible}
            /></div>
            </Button>
          ]}>
          {betterTabs}
        </Panel>
    );
  }
});

module.exports = SidePane;
