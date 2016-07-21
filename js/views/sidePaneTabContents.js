/**
 * Created by twi18192 on 04/05/16.
 */

var React = require('react');

var ReactPanels = require('react-panels');
var Content = ReactPanels.Content;
var Button = ReactPanels.Button;

var Treeview = require('react-treeview');

var blockStore = require('../stores/blockStore');
var attributeStore = require('../stores/attributeStore');
/* Purely for favContent & configContent */
//var paneStore = require('../stores/paneStore');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var WidgetTableContainer = require('./widgetTableContainer');

function getSidePaneTabContentsState(SidePaneTabContentsComponent){
  return{
    blockAttributes: attributeStore.getAllBlockAttributes()
      [SidePaneTabContentsComponent.props.tabObject.label],
    blockAttributesIconStatus: attributeStore.getAllBlockAttributesIconStatus()
      [SidePaneTabContentsComponent.props.tabObject.label],
    //favContent: paneStore.getFavContent(),
    //configContent: paneStore.getConfigContent()
  }
}

var SidePaneTabContents = React.createClass({

  getInitialState: function(){
    console.log("fetching initial state of " + this.props.tabObject.label);
    return getSidePaneTabContentsState(this);
  },

  shouldComponentUpdate: function(nextProps, nextState){
    //console.log(this.props);
    //console.log(this.state);
    //console.log(this.state.blockAttributes);
    //console.log(nextState.blockAttributes);
    //console.log(nextState.blockAttributes !== this.state.blockAttributes);
    return(
     nextState.blockAttributes !== this.state.blockAttributes ||
     nextState.blockAttributesIconStatus !== this.state.blockAttributesIconStatus
    )
  },

  componentDidMount: function(){
    attributeStore.addChangeListener(this._onChange);
    //paneStore.addChangeListener(this._onChange);
    console.log("mounting " + this.props.tabObject.label);
  },

  componentWillUnmount: function(){
    attributeStore.removeChangeListener(this._onChange);
    //paneStore.removeChangeListener(this._onChange);
    console.log("unmounting " + this.props.tabObject.label);
  },

  _onChange: function(){
    this.setState(getSidePaneTabContentsState(this));
  },

  handleMalcolmCall: function(blockName, method, args){
    console.log("malcolmCall in sidePane");
    MalcolmActionCreators.malcolmCall(blockName, method, args)
  },

  handleEdgeDeleteButton: function(EdgeInfo){

    /* Technically the edge delete button is some form of widget,
    but it's such a small one that doesn't require any attribute
    info from the store that it's just been plonked in here,
    perhaps it should go somewhere else though?
     */

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

  generateTabContent: function(blockAttributes){

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
            blockAttributeStatus: this.state.blockAttributesIconStatus[attribute],
            blockName: this.props.tabObject.label,
            attributeName: attribute,
            isInAGroup: isInAGroup,
            key: this.props.tabObject.label + attribute + widgetType,
            widgetType: widgetType
          };

          widgetParent.push(
            <WidgetTableContainer {...commonProps} />
          );

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

    console.log('rerendering: ' + this.props.tabObject.label);

    var tabContent = [];

    //if(this.props.tabObject.tabType === "Favourites"){
    //  tabContent.push(
    //    <p>{this.state.favContent.name}</p>
    //  );
    //}
    //else if(this.props.tabObject.tabType === 'Configuration'){
    //  tabContent.push(
    //    <p>{this.state.configContent.name}</p>
    //  );
    //}
    if(this.props.tabObject.tabType === 'VISIBILITY' ||
        this.props.tabObject.tabType === 'block'){

      /* Making the tab content generator more generic */

      tabContent.push(
        this.generateTabContent(this.state.blockAttributes)
      );
    }
    else if(this.props.tabObject.tabType === 'edge'){

      tabContent.push(
        <button key={this.props.tabObject.label + "edgeDeleteButton"}
                onClick={this.handleEdgeDeleteButton.bind(null, this.props.tabObject)}
        >Delete edge</button>
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
