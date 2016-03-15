/**
 * Created by twi18192 on 01/09/15.
 */

var React = require('react');
var ReactPanels = require('react-panels');
var sidePaneStore = require('../stores/sidePaneStore');
var sidePaneActions = require('../actions/sidePaneActions');
var Dropdown = require('./dropdownMenu');
//var mainPaneStore = require('../stores/mainPaneStore');

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

var SidePane = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return (
      nextProps.selectedTabIndex !== this.props.selectedTabIndex ||
      nextProps.listVisible !== this.props.listVisible ||
      nextProps.tabState !== this.props.tabState ||
      nextProps.allBlockInfo !== this.props.allBlockInfo ||
      nextProps.favContent !== this.props.favContent ||
      nextProps.configContent !== this.props.configContent ||
      nextProps.allBlockAttributes !== this.props.allBlockAttributes
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

  //enterKeyDown: function(blockInfo, inputFieldElement,e){
  //  console.log(blockInfo);
  //  console.log(inputFieldElement);
  //  console.log(e);
  //
  //  //document.removeEventListener('onkeydown', this.enterKeyPress);
  //
  //  if(e.keyCode == 13){
  //    var inputFieldValue = inputFieldElement.value;
  //    console.log(inputFieldValue);
  //
  //    /* Now i need to pass malcolmCall the corresponding
  //    method and arguments
  //     */
  //
  //    var inputFieldSetMethodName = "_set_" + blockInfo.attribute;
  //    var argsObject = {
  //
  //    };
  //
  //    for(var key in blockInfo){
  //      if(blockInfo[key] === blockInfo.attribute){
  //        argsObject[blockInfo.attribute] = inputFieldValue;
  //      }
  //    }
  //
  //    console.log(argsObject);
  //
  //    this.handleMalcolmCall(blockInfo.block, inputFieldSetMethodName, argsObject);
  //
  //    document.removeEventListener('keydown', this.enterKeyDown);
  //
  //  }
  //
  //},

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

  //enterKeyPress: function(e){
  //  if(e.keyCode == 13) {
  //
  //    window.alert("keypress!");
  //
  //  }
  //},

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

    var inputFieldSetMethodName = "_set_" + blockInfo.attribute;
    var argsObject = {};

    for (var key in blockInfo) {
      if (blockInfo[key] === blockInfo.attribute) {
        argsObject[blockInfo.attribute] = clickedOptionFromDropdownMenu;
      }
    }

    this.handleMalcolmCall(blockInfo.block, inputFieldSetMethodName, argsObject);

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

          /* Shall replace the inports & outports treeviews with
          the attributes and their values (the attributes will
          be a treeview at some point too)
           */

          /* Need to check if it's a readout or an
           editable field
           */

          var blockAttributesDivs = [];

          /* Each attribute needs a treeview, so I need
          to put each attribute div inside a treeview tag?
          Then I push that treeview into blockAttributeDivs,
          which in turn gets pushed into tabContent at the very
          end of the loop
           */

          for(var attribute in this.props.allBlockAttributes[block]){

            var attributeLabel;
            var attributeDiv = [];

            console.log(this.props.allBlockAttributes);
            console.log(attribute);
            console.log(this.props.allBlockAttributes[block][attribute]);

            if(this.props.allBlockAttributes[block][attribute].tags === undefined){
              attributeLabel =
                <div style={{position: 'relative', left: '20', bottom: '38px', width: '230px', height: '25px'}}>
                  <p key={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                     id={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                     style={{fontSize: '13px', position: 'relative', top: '5px'}}>
                    {String(attribute)}
                  </p>
                  <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
                    <button style={{position: 'relative', left: '215px',}}>Icon</button>
                    <input
                      style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999', color: 'green'}}
                      value={String(this.props.allBlockAttributes[block][attribute].value)}
                      readOnly="readonly" maxLength="17" size="17"/>
                  </div>
                </div>;

              /* Now need to push the appropriate content
              of a treeview element: ie, other readouts for methods,
              alarm status etc
               */

              for(var subAttribute in this.props.allBlockAttributes[block][attribute]){
                /* In a similar vain, need to check if it's
                just a readout, or there's another subtree!
                 */

                if(typeof this.props.allBlockAttributes[block][attribute][subAttribute] === "string"){
                  /* Just a readout, so no subtree needed */

                  attributeDiv.push(
                    <div style={{position: 'relative', left: '10', bottom: '0px', width: '230px', height: '25px'}}>
                      <p key={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + subAttribute + "textContent"}
                         id={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + subAttribute + "textContent"}
                         style={{fontSize: '13px', position: 'relative', top: '0px', margin: '0px' }}>
                        {String(subAttribute)}
                      </p>
                      <div style={{position: 'relative', bottom: '18px', left: '64px'}}>
                        <button style={{position: 'relative', left: '215px',}}>Icon</button>
                        <input
                          style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999', color: 'green'}}
                          value={String(this.props.allBlockAttributes[block][attribute][subAttribute])}
                          readOnly="readonly" maxLength="17" size="17"/>
                      </div>
                    </div>
                  )
                }
                else{

                  /* Need to create yet ANOTHER subtree for
                  the attributes of the sub-attribute
                   */

                  attributeDiv.push(
                    <div style={{position: 'relative', left: '10', bottom: '0px', width: '230px', height: '25px'}}>
                      <p key={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + subAttribute + "textContent"}
                         id={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + subAttribute + "textContent"}
                         style={{fontSize: '13px', position: 'relative', top: '0px', margin: '0px'}}>
                        {String(subAttribute)}
                      </p>
                      <div style={{position: 'relative', bottom: '18px', left: '64px'}}>
                        <button style={{position: 'relative', left: '215px',}}>Icon</button>
                        <input
                          style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999', color: 'green'}}
                          value={String(this.props.allBlockAttributes[block][attribute][subAttribute])}
                          readOnly="readonly" maxLength="17" size="17"/>
                      </div>
                    </div>
                  )
                }

              }

            }
            else if(this.props.allBlockAttributes[block][attribute].tags !== undefined) {

              /* USE, BLOCKNAME, and uptime all are missing the tags field,
              so I shall have to include them in in some other fashion
               */

              for (var k = 0; k < this.props.allBlockAttributes[block][attribute].tags.length; k++) {
                if (this.props.allBlockAttributes[block][attribute].tags[k].indexOf('method') !== -1) {
                  /* Then we have a method, so need to include more stuff here */

                  /* Also need to check if the method requires
                  a dropdown list, ie, fi the value type is 'VEnum'
                   */

                  if(this.props.allBlockAttributes[block][attribute].type.name === "VEnum"){
                    /* Need to iterate through the list of options
                    and create a <select> tag with all the <option>
                    tags within it
                     */

                    var dropdownOptions = [];

                    for(var m = 0; m < this.props.allBlockAttributes[block][attribute].type.labels.length; m++){
                      /* Check which option needs to be selected
                      on initial render by checking the value
                      from the server?
                       */

                      if(this.props.allBlockAttributes[block][attribute].type.labels[m] ===
                        this.props.allBlockAttributes[block][attribute].value){
                        dropdownOptions.push(
                          <option value={this.props.allBlockAttributes[block][attribute].type.labels[m]}
                                  selected="selected" >
                            {this.props.allBlockAttributes[block][attribute].type.labels[m]}
                          </option>
                        )
                      }
                      else {
                        dropdownOptions.push(
                          <option value={this.props.allBlockAttributes[block][attribute].type.labels[m]}
                          >
                            {this.props.allBlockAttributes[block][attribute].type.labels[m]}
                          </option>
                        )
                      }
                    }

                    var dropdownList =
                      <select onChange={this.onChangeBlockMethodDropdownOption.bind(null, {
                            block: block,
                            attribute: attribute
                            })}
                              style={{width: '160px'}} >
                        {dropdownOptions}
                      </select>;

                    attributeLabel =
                      <div style={{position: 'relative', left: '20', bottom: '38px', width: '230px', height: '25px'}}>
                        <p key={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                           id={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                           style={{fontSize: '13px', position: 'relative', top: '5px'}}>
                          {String(attribute)}
                        </p>
                        <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
                          <button style={{position: 'relative', left: '215px',}}>Icon</button>
                          {dropdownList}
                        </div>
                      </div>;

                  }
                  else {

                    attributeLabel =
                      <div style={{position: 'relative', left: '20', bottom: '38px', width: '230px', height: '25px'}}>
                        <p key={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                           id={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                           style={{fontSize: '13px', position: 'relative', top: '5px'}}>
                          {String(attribute)}
                        </p>
                        <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
                          <button style={{position: 'relative', left: '215px',}}>Icon</button>
                          <input id={block + attribute + "inputField"}
                                 style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999',
                            //contentEditable:"true"
                            color: 'blue'}}
                                 defaultValue={String(this.props.allBlockAttributes[block][attribute].value)}
                                 onChange={this.attributeFieldOnChange.bind(null, {
                            block: block,
                            attribute: attribute
                            })}
                                 onClick={this.selectedInputFieldText.bind(null, block + attribute + "inputField")}
                                 maxLength="17" size="17"/>
                        </div>
                      </div>;

                  }

                  //attributeDiv.push(
                  //  <div style={{position: 'relative', left: '0', bottom: '2px', width: '230px', height: '25px'}}>
                  //    <p key={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                  //       id={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                  //       style={{fontSize: '14px', position: 'relative', top: '5px'}}>
                  //      {String(attribute)}
                  //    </p>
                  //    <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
                  //      <button style={{position: 'relative', left: '160px',}}>Icon</button>
                  //      <input id={block + attribute + "inputField"}
                  //        style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999',
                  //        //contentEditable:"true"
                  //        }}
                  //        defaultValue={String(this.props.allBlockAttributes[block][attribute].value)}
                  //        onChange={this.attributeFieldOnChange.bind(null, {
                  //        block: block,
                  //        attribute: attribute
                  //        })}
                  //        onClick={this.selectedInputFieldText.bind(null, block + attribute + "inputField")}
                  //        maxLength="10" size="10"/>
                  //    </div>
                  //  </div>
                  //);

                }
                else {
                  /* It's simply a readout field, so nothing special is
                   required here
                   */

                  console.log(this.props.allBlockAttributes[block][attribute].value);

                  attributeLabel =
                    <div style={{position: 'relative', left: '20', bottom: '38px', width: '230px', height: '25px'}}>
                      <p key={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                         id={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                         style={{fontSize: '13px', position: 'relative', top: '5px'}}>
                        {String(attribute)}
                      </p>
                      <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
                        <button style={{position: 'relative', left: '215px',}}>Icon</button>
                        <input
                          style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999', color: 'green'}}
                          value={String(this.props.allBlockAttributes[block][attribute].value)}
                          readOnly="readonly" maxLength="17" size="17"/>
                      </div>
                    </div>;

                  //attributeDiv.push(
                  //  <div style={{position: 'relative', left: '0', bottom: '2px', width: '230px', height: '25px'}}>
                  //    <p key={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                  //       id={this.props.allBlockAttributes[block].BLOCKNAME.value + attribute + "textContent"}
                  //       style={{fontSize: '14px', position: 'relative', top: '5px'}}>
                  //      {String(attribute)}
                  //    </p>
                  //    <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
                  //      <button style={{position: 'relative', left: '160px',}}>Icon</button>
                  //      <input
                  //        style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999'}}
                  //        value={String(this.props.allBlockAttributes[block][attribute].value)}
                  //        readOnly="readonly" maxLength="10" size="10"/>
                  //    </div>
                  //  </div>
                  //);

                }
              }
            }

            blockAttributesDivs.push(
              //<div id={block + attribute + "treeviewContainer"} >
                <Treeview key={block + attribute + "treeview"}
                          nodeLabel={attributeLabel}
                          defaultCollapsed={true}
                > {attributeDiv}
                </Treeview>
              //</div>
            );

          }

          tabContent.push(blockAttributesDivs);


          //for (var j = 0; j < this.props.allBlockAttributes[block].tags; j++) {
          //  if (this.props.allBlockAttributes[block].tags[j].indexOf('method') !== -1) {
          //    /* Then we have a method, so need to include more stuff here */
          //
          //    for (var attribute in this.props.allBlockAttributes[block]) {
          //
          //      blockAttributesDivs.push(
          //        <div style={{position: 'relative', left: '0', bottom: '2px', width: '230px', height: '25px'}}>
          //          <p key={this.props.allBlockAttributes[block].BLOCKNAME.VALUE + attribute + "textContent"}
          //             id={this.props.allBlockAttributes[block].BLOCKNAME.VALUE + attribute + "textContent"}
          //             style={{fontSize: '14px', position: 'relative', top: '5px'}}>
          //            {String(attribute)}
          //          </p>
          //          <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
          //            <button style={{position: 'relative', left: '160px',}}>Icon</button>
          //            <input
          //              style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999'}}
          //              value={String(this.props.allBlockAttributes[block][attribute].value)}
          //              type="submit" size="10"/>
          //          </div>
          //        </div>
          //      )
          //    }
          //
          //  }
          //  else{
          //    /* It's simply a readout field, so nothing special is
          //    required here
          //     */
          //
          //    for (var attribute in this.props.allBlockAttributes[block]) {
          //
          //      blockAttributesDivs.push(
          //        <div style={{position: 'relative', left: '0', bottom: '2px', width: '230px', height: '25px'}}>
          //          <p key={this.props.allBlockAttributes[block].BLOCKNAME.VALUE + attribute + "textContent"}
          //             id={this.props.allBlockAttributes[block].BLOCKNAME.VALUE + attribute + "textContent"}
          //             style={{fontSize: '14px', position: 'relative', top: '5px'}}>
          //            {String(attribute)}
          //          </p>
          //          <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
          //            <button style={{position: 'relative', left: '160px',}}>Icon</button>
          //            <input
          //              style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999'}}
          //              value={String(this.props.allBlockAttributes[block][attribute].value)}
          //              readOnly="readonly" maxLength="10" size="10"/>
          //          </div>
          //        </div>
          //      );
          //    }
          //  }
          //}

          //for (var attribute in this.props.allBlockAttributes[block]) {
          //
          //    blockAttributesDivs.push(
          //      <div style={{position: 'relative', left: '0', bottom: '2px', width: '230px', height: '25px'}}>
          //        <p key={this.props.allBlockAttributes[block].BLOCKNAME.VALUE + attribute + "textContent"}
          //           id={this.props.allBlockAttributes[block].BLOCKNAME.VALUE + attribute + "textContent"}
          //           style={{fontSize: '14px', position: 'relative', top: '5px'}}>
          //          {String(attribute)}
          //        </p>
          //        <div style={{position: 'relative', bottom: '30px', left: '90px'}}>
          //          <button style={{position: 'relative', left: '160px',}}>Icon</button>
          //          <input
          //            style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999'}}
          //            value={String(this.props.allBlockAttributes[block][attribute].value)}
          //            readOnly="readonly" maxLength="10" size="10"/>
          //        </div>
          //      </div>
          //    );
          //  }

          //tabContent.push(blockAttributesDivs);


          //var inportDivs = [];
          //var outportDivs = [];
          //
          //for (var j = 0; j < this.props.allBlockInfo[block].inports.length; j++) {
          //      console.log(this.props.allBlockInfo[block]);
          //      console.log(this.props.allBlockInfo[block].inports[j]);
          //
          //  /* For getting the tree label to expand/collapse the treeview too */
          //  var interactJsIdString = "#" + this.props.allBlockInfo[block].inports[j].name + "textContent";
          //
          //  inportDivs.push(
          //    <div style={{position: 'relative', left: '0', bottom: '2px', width: '230px', height: '25px'}} >
          //      <p key={this.props.allBlockInfo[block].inports[j].name + "textContent"}
          //         id={this.props.allBlockInfo[block].inports[j].name + "textContent"}
          //         style={{fontSize: '14px', position: 'relative', top: '5px'}} >
          //        {String(this.props.allBlockInfo[block].inports[j].name).toUpperCase()}
          //      </p>
          //      <div style={{position: 'relative', bottom: '30px', left: '70px'}} >
          //        <button style={{position: 'relative', left: '160px',}}  >Icon</button>
          //        <input style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999'}}
          //               value={String(this.props.allBlockInfo[block].inports[j].value)}
          //               readOnly="readonly" maxLength="10" size="10" />
          //      </div>
          //
          //    </div>
          //  );
          //}
          //
          //tabContent.push(
          //  <Treeview key={"InportsTreeview"}
          //            nodeLabel={<b>Inports</b>}
          //            defaultCollapsed={false}
          //  >{inportDivs}
          //  </Treeview>
          //);
          //
          //tabContent.push(<br/>);
          //
          //for (var k = 0; k < this.props.allBlockInfo[block].outports.length; k++){
          //  outportDivs.push(
          //    <div style={{position: 'relative', left: '0', bottom: '2px', width: '230px', height: '25px'}} >
          //
          //      <p key={this.props.allBlockInfo[block].outports[k].name + "textContent"}
          //         id={this.props.allBlockInfo[block].outports[k].name + "textContent"}
          //         style={{fontSize: '14px', position: 'relative', top: '5px'}}>
          //        {String(this.props.allBlockInfo[block].outports[k].name).toUpperCase()}
          //      </p>
          //
          //      <div style={{position: 'relative', bottom: '30px', left: '70px'}} >
          //
          //        <button style={{position: 'relative', left: '160px',}}  >Icon</button>
          //        <input style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999',
          //        //boxShadow: '0px 0px 8px rgba(255, 255, 255, 0.3)'
          //        }}
          //               value={String(this.props.allBlockInfo[block].outports[k].value)}
          //               readOnly="readonly" maxLength="10" size="10" />
          //      </div>
          //
          //    </div>
          //  )
          //}
          //
          //tabContent.push(
          //  <Treeview key={"OutportTreeview"}
          //            nodeLabel={<b>Outports</b>}
          //            defaultCollapsed={false}
          //            >{outportDivs}
          //  </Treeview>
          //);

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

    //<b>Attributes of {tabLabel}</b> <br/>


    /* Using allBlockTabInfo instead of going through the intermediate tabState array */
    //var calculateTabsInfo = function() {
    //  var i = 0;
    //  var tabs = [];
    //  console.log(this.props.allBlockTabInfo);
    //  console.log(this.props.allBlockTabOpenStates);
    //  for (var block in this.props.allBlockTabInfo) {
    //    console.log(block);
    //    i = i + 1;
    //    console.log(this.props.allBlockTabOpenStates[block]);
    //    console.log(block.label);
    //    if (this.props.allBlockTabOpenStates[block] === true) {
    //      console.log("a tab is open, time to calculate its contents");
    //      var tabContent = [];
    //
    //      tabContent.push(<p>x: {this.props.allBlockTabInfo[block].position.x}</p>);
    //      tabContent.push(<p>y: {this.props.allBlockTabInfo[block].position.y}</p>);
    //      tabContent.push(<br/>);
    //
    //      tabContent.push(<p>Inports</p>);
    //      for (var j = 0; j < this.props.allBlockTabInfo[block].inports.length; j++) {
    //        for (var attribute in this.props.allBlockTabInfo[block].inports[j]) {
    //          if (attribute !== 'connectedTo') {
    //            console.log(block);
    //            console.log(this.props.allBlockTabInfo[block].inports[j][attribute]);
    //            tabContent.push(<p>{attribute}: {String(this.props.allBlockTabInfo[block].inports[j][attribute])}</p>);
    //          }
    //          else if (attribute === 'connectedTo') {
    //            tabContent.push(<p>connectedTo:</p>);
    //            if (this.props.allBlockTabInfo[block].inports[j].connectedTo !== null) {
    //              //for (var subAttribute in block.inports[j].connectedTo) {
    //              tabContent.push(<p>block: {this.props.allBlockTabInfo[block].inports[j].connectedTo.block}</p>);
    //              tabContent.push(<p>port: {this.props.allBlockTabInfo[block].inports[j].connectedTo.port}</p>);
    //              //}
    //            }
    //            else if (this.props.allBlockTabInfo[block].inports[j].connectedTo === null) {
    //              tabContent.push(<p>null</p>);
    //            }
    //          }
    //        }
    //        //tabContent.push(<p>, </p>);
    //      }
    //      tabContent.push(<br/>);
    //
    //      console.log(tabContent);
    //
    //      tabContent.push(<p>Outports</p>);
    //      for (var k = 0; k < this.props.allBlockTabInfo[block].outports.length; k++) {
    //        /* connectedTo for an outport is an array, so have to iterate through an array rather than using a for in loop */
    //        for (var attribute in this.props.allBlockTabInfo[block].outports[k]) {
    //          if (attribute !== 'connectedTo') {
    //            console.log(attribute);
    //            tabContent.push(<p>{attribute}: {String(this.props.allBlockTabInfo[block].outports[k][attribute])}</p>);
    //          }
    //          else if (attribute === 'connectedTo') {
    //            console.log(attribute);
    //            tabContent.push(<p>connectedTo:</p>);
    //            if (this.props.allBlockTabInfo[block].outports[k].connectedTo.length === 0) {
    //              console.log("LENGTH OF ARRAY IS ZERO");
    //              tabContent.push(<p>[]</p>);
    //            }
    //            else if (this.props.allBlockTabInfo[block].outports[k].connectedTo !== null) {
    //              for (var l = 0; l < this.props.allBlockTabInfo[block].outports[k].connectedTo.length; l++) {
    //                tabContent.push(<p>[block: {this.props.allBlockTabInfo[block].outports[k].connectedTo[l]['block']},</p>);
    //                tabContent.push(<p>port: {this.props.allBlockTabInfo[block].outports[k].connectedTo[l]['port']}]</p>)
    //              }
    //            }
    //            else if (this.props.allBlockTabInfo[block].outports[k].connectedTo === null) {
    //              tabContent.push(<p>null</p>);
    //            }
    //          }
    //        }
    //        //tabContent.push(<p>, </p>);
    //      }
    //      tabs.push(
    //        <Tab title={this.props.allBlockTabInfo[block].label}>
    //
    //          <Content>Attributes of {this.props.allBlockTabInfo[block].label} <br/> Tab number {i}
    //            {tabContent}
    //          </Content>
    //
    //        </Tab>
    //      )
    //    }
    //    else if (this.props.allBlockTabOpenStates[block] === false) {
    //      console.log("that block tab wasn't open, so don't open the " + block.label + " tab");
    //    }
    //  }
    //  console.log(tabs);
    //
    //  return(
    //    tabs
    //  )
    //}.bind(this);

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

//<p style={{margin: '0px'}} >hello</p>
//<p style={{margin: '0px'}} >yo</p>
//<p style={{margin: '0px'}} >yes</p>
