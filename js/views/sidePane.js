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

var ToggleSwitch = require('react-toggle-switch');
var BlockToggleSwitch = require('./blockToggleSwitch');

//var TreeviewComponent = require('react-treeview-component');

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
    blockActions.deleteEdge(EdgeInfo);

    /* Reset port styling too */

    var fromBlockPortElement = document.getElementById(EdgeInfo.fromBlock + EdgeInfo.fromBlockPort);
    var toBlockPortElement = document.getElementById(EdgeInfo.toBlock + EdgeInfo.toBlockPort);

    fromBlockPortElement.style.fill = "grey";
    toBlockPortElement.style.fill = "grey";
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

  attributeFieldOnChange: function(blockInfo, e){
    console.log("field changed, wait for the enter key?");
    console.log(e);
    console.log(blockInfo);

    var blockAttributeInputField = document.getElementById(blockInfo.block + blockInfo.attribute + "inputField");

    console.log(blockAttributeInputField);

    var appContainerElement = document.getElementById('appContainer');
    console.log(appContainerElement);

    document.addEventListener('keyup', this.enterKeyUp.bind(null, blockInfo, blockAttributeInputField));
    appContainerElement.addEventListener('mouseup', this.mouseUp.bind(null, blockInfo, blockAttributeInputField));

  },

  enterKeyUp: function(blockInfo, inputFieldElement, e){

    /* Just put it all in keyup, that way I don't
    have to deal with if the user holds the key down
    and the GUI ends up firing off lots of keydown/call method
    events
     */

    if(e.keyCode == 13) {

      var inputFieldValue;

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

      var inputFieldSetMethodName = "_set_" + blockInfo.attribute;
      var argsObject = {

      };

      for(var key in blockInfo){
        if(blockInfo[key] === blockInfo.attribute){
          argsObject[blockInfo.attribute] = inputFieldValue;
        }
      }

      console.log(argsObject);

      this.handleMalcolmCall(blockInfo.block, inputFieldSetMethodName, argsObject);

      //document.removeEventListener('keydown', this.enterKeyDown);

      var appContainerElement = document.getElementById('appContainer');

      inputFieldElement.blur();
      document.removeEventListener('keyup', this.enterKeyUp);
      appContainerElement.removeEventListener('mouseup', this.mouseUp);

    }
  },

  mouseUp: function(blockInfo, inputFieldElement,e){

    /* e.target can tell what exactly you clicked on,
    so use it to check the id!
     */

    if(e.target.id !== inputFieldElement.id) {

      var inputFieldValue;

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

      /* Now I need to pass malcolmCall the corresponding
       method and arguments
       */

      var inputFieldSetMethodName = "_set_" + blockInfo.attribute;
      var argsObject = {};

      for (var key in blockInfo) {
        if (blockInfo[key] === blockInfo.attribute) {
          argsObject[blockInfo.attribute] = inputFieldValue;
        }
      }

      console.log(argsObject);

      this.handleMalcolmCall(blockInfo.block, inputFieldSetMethodName, argsObject);

      var appContainerElement = document.getElementById('appContainer');

      inputFieldElement.blur();
      appContainerElement.removeEventListener('mouseup', this.mouseUp);
      document.removeEventListener('keyup', this.enterKeyUp);
    }
    else if(e.target === inputFieldElement.id){
      console.log("clicked on the field again, so don't submit it!");
    }

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

  generateBlockTabContent: function(blockAttributes, blockName){

    var blockAttributeDivs = [];

    var groupsObject = {};

    for(var attribute in blockAttributes){
      var attributeLabel;
      /* Not sure if this'll be needed ifI don't
      need treeview for th subattributes?
       */
      //var attributeDiv = [];

      if(blockAttributes[attribute].tags === undefined &&
        blockAttributes[attribute].alarm === undefined){
        /* Then it's a group, so create a treeview */
        /* The best I can do I think is to now do a
        for loop in here through all the block attributes
        to find all the attributes belonging to this
        group?
         */

        /* Creating the array that I'll push the
        treeview children to as the upper for loop
        goes through all the attributes of the block
         */
        groupsObject[attribute] = [];

        //attributeLabel =
        //  <Treeview defaultCollapsed={true}
        //            nodeLabel={
        //            <b style={{marginLeft: '-47px'}}>{attribute}</b>
        //            } >
        //  </Treeview>

      }
      else if(blockAttributes[attribute].tags === undefined &&
        blockAttributes[attribute].alarm !== undefined){
        /* Then it's a readonly readout,
         no methods or anything
         */

        attributeLabel =
          <NonEditableReadoutField blockAttribute={blockAttributes[attribute]}
                                   blockName={blockName}
                                   attributeName={attribute} />;

        blockAttributeDivs.push(attributeLabel);



      }
      else if(blockAttributes[attribute].tags !== undefined){
        /* Could be a readonly readout,
         or could be a editable method
         readout (text or dropdown)
         */


        var isMethod = false;

        for(var k = 0; k < blockAttributes[attribute].tags.length; k++){
          if(blockAttributes[attribute].tags[k].indexOf('method') !== -1){
            isMethod = true;
          }
          else{
            /* Do nothing, keep isMethod as false */
          }

          /* Need to find what group the
           attribute belongs to as well
           */

          if(blockAttributes[attribute].tags[k].indexOf('group') !== -1 ){

            var groupName = blockAttributes[attribute].tags[k].slice('group:'.length);

          }

        }

        if(isMethod === false){
          /* Normal readonly readout */

          groupsObject[groupName].push(
            <NonEditableReadoutField blockAttribute={blockAttributes[attribute]}
                                     blockName={blockName}
                                     attributeName={attribute} />
          )

        }
        else if(isMethod === true){
          /* It's a method, now need to check
          if it's a text one or a dropdown
          one
           */

          if(blockAttributes[attribute].type.name === 'VEnum'){
            /* Use the dropdown editable
             readout field element
             */

            groupsObject[groupName].push(
              <DropdownEditableReadoutField blockAttribute={blockAttributes[attribute]}
                                            blockName={blockName}
                                            attributeName={attribute}
                                            onChangeBlockMethodDropdownOption={
                                            this.onChangeBlockMethodDropdownOption
                                            }  />
            )

          }
          else{
            /* It's a text editable readout
             field
             */

            groupsObject[groupName].push(
              <TextEditableReadoutField blockAttribute={blockAttributes[attribute]}
                                        blockName={blockName}
                                        attributeName={attribute}
                                        attributeFieldOnChange={this.attributeFieldOnChange}
                                        selectedInputFieldText={this.selectedInputFieldText} />
            )

          }

        }


      }

      //blockAttributeDivs.push(attributeLabel);

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
        > {groupsObject[group]}
        </Treeview>
      )
    }

    //for(var group in groupsObject){
    //  blockAttributeDivs.push(
    //    <TreeviewComponent dataSource={{
    //      id: group + "treeview",
    //      text: group,
    //      icon: group,
    //      opened: true,
    //      selected: true,
    //      children: groupsObject[group]
    //    }} onTreenodeClick={function(e){console.log("treenode click!")}}
    //    />
    //  )
    //}

    return blockAttributeDivs;

  },

  disableTabKey: function(e){
    console.log(e);
    if(e.keyCode === 9){
      console.log("tab key!");
      e.preventDefault();
    }
  },

  toggleSwitch: function(blockName, value, e){
    console.log(value);
    console.log(blockName);

    /* invoke malcolmCall to toggle the visible attribute
    of the given block
     */

    /* If I'm toggling, I want to pass the OPPOSITE of
    whatever the current value of the toggle is
     */

    var newValue;
    var argsObject = {};

    if(value === 'true'){
      newValue = 'false';
    }
    else if(value === 'false'){
      newValue = 'true'
    }

    var methodToInvoke = '_set_' + blockName + '_visible';

    var argsValue;

    if(newValue === 'true'){
      argsValue = 'Show';
    }
    else if(newValue === 'false'){
      argsValue = 'Hide';
    }

    argsObject[blockName] = argsValue;

    console.log(argsValue);

    /* Now invoke malcolmCall */

    this.handleMalcolmCall('VISIBILITY', methodToInvoke, argsObject);
    /* Note: the first argument is 'VISIBILITY' so then I am
    invoking the method via Z:VISIBILITY rather than the block
    itself, seems more organised to do it all through that
     */

  },


  render: function () {

    console.log("render: sidePane");
    console.log(this.props.tabState);

    var skin = this.props.skin || "default",
      globals = this.props.globals || {};

    var betterTabs = this.props.tabState.map(function(block, i){
      /* Using strings in tabState instead of obejct so I can just point to this.props.allBlockInfo[block] to show
      the data, rather than having to redupdate allBlockTabInfo via waitFor every time blockStore's allBlockInfo changes
       */
      //var tabLabel = block.label;
      var tabIndex = i + 1;

      var betterTabContent = function() {

        var tabContent = [];

        if(block === "Favourites"){
          console.log("we have a favourites tab");
          tabContent.push(<p>{this.props.favContent.name}</p>);
          var tabTitle = 'yh';
        }
        else if(block === 'Configuration'){
          console.log("we have a config tab");
          tabContent.push(<p>{this.props.configContent.name}</p>);
          var tabTitle = 'yh';
        }
        else if(block === 'BlockLookupTable'){
          console.log("we have the blockLookupTable tab");

          var sortedBlocksUnderGroupNames = {};

          for(var m = 0; m < this.props.blockGroups.length; m++){
            sortedBlocksUnderGroupNames[this.props.blockGroups[m]] = [];

            for(var blockName in this.props.blocksVisibility){
              if(blockName.indexOf(this.props.blockGroups[m]) !== -1){
                sortedBlocksUnderGroupNames[this.props.blockGroups[m]].push(blockName)
              }
            }
          }

          for(var blockGroup in sortedBlocksUnderGroupNames){
            if(sortedBlocksUnderGroupNames[blockGroup].length > 1){

              var groupMembersToggleSwitches = [];

              for(var i = 0; i < sortedBlocksUnderGroupNames[blockGroup].length; i++){

                groupMembersToggleSwitches.push(
                  <BlockToggleSwitch blockName={sortedBlocksUnderGroupNames[blockGroup][i]}
                                     toggleSwitch={this.toggleSwitch}
                                     toggleOrientation={
                                     this.props.blocksVisibility[sortedBlocksUnderGroupNames[blockGroup][i]]
                                     .value === 'Show'
                                     }
                                     />
                )
              }

              tabContent.push(
                <Treeview defaultCollapsed={true}
                          nodeLabel={
                          <b style={{}} >{blockGroup}</b>
                          }
                > {groupMembersToggleSwitches}
                </Treeview>
              )
            }
            else{
              tabContent.push(
                <BlockToggleSwitch blockName={sortedBlocksUnderGroupNames[blockGroup][0]}
                                   toggleSwitch={this.toggleSwitch}
                                   toggleOrientation={
                                     this.props.blocksVisibility[sortedBlocksUnderGroupNames[blockGroup][0]]
                                     .value === 'Show'
                                     }
                />
              );
            }
          }

          //for(var n = 0; n < this.props.blocksVisibility.length; n++){
          //  /* Need to push to the correct treeview somehow,
          //  perhaps nest this inside the block groups loop?
          //   */
          //  tabContent.push(
          //    <BlockToggleSwitch toggleSwitch={this.toggleSwitch}
          //                       blockName={this.props.blocksVisibility[n].slice(2)} />
          //  );
          //}


          var tabTitle = 'yh';
        }
        else if(block.tabType === 'edge'){
          console.log("we have an edge tab!!");

          var tabLabel = block.label;

          tabContent.push(
            <button key={tabLabel + "edgeDeleteButton"} onClick={this.handleEdgeDeleteButton.bind(null, block)}
            >Delete edge</button>
          );
        }
        else {
          console.log("normal block tab");
          var tabTitle = "Attributes of " + tabLabel;

          tabContent.push(this.generateBlockTabContent(this.props.allBlockAttributes[block], block));
        }
        console.log(tabContent);
        return tabContent;
      }.bind(this);

      return (
        <Tab key={block + "tab"} title={block}>

          <Content key={block + "content"} >
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
