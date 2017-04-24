/**
 * Created by twi18192 on 04/05/16.
 */

let React = require('react');

let ReactPanels = require('react-panels');
let Content     = ReactPanels.Content;
let Button      = ReactPanels.Button;

let Treeview = require('react-treeview');

import blockStore  from '../stores/blockStore';
import attributeStore from '../stores/attributeStore';
import MalcolmUtils from '../utils/MalcolmUtils';
import appConstants from '../constants/appConstants';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';

/* Purely for favContent & configContent */
//let paneStore = require('../stores/paneStore');

let WidgetTableContainer = require('./widgetTableContainer');

function getSidePaneTabContentsState(SidePaneTabContentsComponent)
  {
  return {
    blockAttributes          : attributeStore.getAllBlockAttributes()[SidePaneTabContentsComponent.props.tabObject.label],
    blockAttributesIconStatus: attributeStore.getAllBlockAttributesIconStatus()[SidePaneTabContentsComponent.props.tabObject.label],
    //favContent: paneStore.getFavContent(),
    //configContent: paneStore.getConfigContent()
  }
  }

let SidePaneTabContents = React.createClass(
  {
    propTypes: {
      tabObject: React.PropTypes.object
    },
    
    getInitialState: function ()
      {
      console.log("fetching initial state of " + this.props.tabObject.label);
      return getSidePaneTabContentsState(this);
      },
    
    shouldComponentUpdate: function (nextProps, nextState)
      {
      //console.log(this.props);
      //console.log(this.state);
      //console.log(this.state.blockAttributes);
      //console.log(nextState.blockAttributes);
      //console.log(nextState.blockAttributes !== this.state.blockAttributes);
      return (
        nextState.blockAttributes !== this.state.blockAttributes ||
        nextState.blockAttributesIconStatus !== this.state.blockAttributesIconStatus
      )
      },
    
    componentDidMount: function ()
      {
      attributeStore.addChangeListener(this._onChange);
      //paneStore.addChangeListener(this._onChange);
      console.log("mounting " + this.props.tabObject.label);
      },
    
    componentWillUnmount: function ()
      {
      attributeStore.removeChangeListener(this._onChange);
      //paneStore.removeChangeListener(this._onChange);
      console.log("unmounting " + this.props.tabObject.label);
      },
    
    _onChange: function ()
      {
      this.setState(getSidePaneTabContentsState(this));
      },

    handleMalcolmCall: function (blockName, method, args)
      {
      console.log("malcolmCall in sidePane");
      MalcolmActionCreators.malcolmCall(blockName, method, args);
      },

    handleMalcolmPut: function (blockName, endpoint, value)
      {
      console.log("malcolmPut in sidePane");
      MalcolmActionCreators.malcolmPut(blockName, endpoint, value);
      },

    handleEdgeDeleteButton: function (EdgeInfo)
      {
      
      /* Technically the edge delete button is some form of widget,
       but it's such a small one that doesn't require any attribute
       info from the store that it's just been plonked in here,
       perhaps it should go somewhere else though?
       */
      
      let argumentValue;
      
      /* Need to know the type of the port value,
       so a get from blockStore may be in order
       */
    
      let allBlockInfo = blockStore.getAllBlockInfo();
      
      for (let i = 0; i < allBlockInfo[EdgeInfo.toBlock].inports.length;
           i++)
        {
        //console.log(blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports[i].connectedTo);
        let blockinfo = allBlockInfo[EdgeInfo.toBlock];
        let inport = blockinfo.inports[i];

        if (inport.connectedTo !== null &&
          inport.connectedTo.block === EdgeInfo.fromBlock &&
          inport.connectedTo.port === EdgeInfo.fromBlockPort)
          {
          if ((inport.type === appConstants.MALCOLM_TYPE_BOOL) || (inport.type == appConstants.MALCOLM_TYPE_INT32))
            {
            argumentValue = appConstants.MALCOLM_VALUE_ZERO;
            }
          }
        }

      let endpoint = [MalcolmActionCreators.getdeviceId()+"-"+EdgeInfo.toBlock, EdgeInfo.toBlockPort, "value"];
      this.handleMalcolmPut(EdgeInfo.toBlock, endpoint, argumentValue);

      },
    
    generateTabContent: function (blockAttributes)
      {
      
      let blockAttributeDivs = [];
      
      let groupsObject = {};
      
      for (let attribute in blockAttributes)
        {
        
        if ((MalcolmUtils.hasOwnNestedProperties(blockAttributes[attribute],"meta", "tags") === undefined) &&
          (blockAttributes[attribute].alarm === undefined))
          {
          
          /* Creating the array that I'll push the
           treeview children to as the upper for loop
           goes through all the attributes of the block
           */
          groupsObject[attribute] = [];
            
          }
        else if (MalcolmUtils.hasOwnNestedProperties(blockAttributes[attribute],"meta", "tags"))
          {
          let groupName;
          let isWidget   = false;
          let widgetType;
          let isInAGroup = false;
          let widgetParent = blockAttributeDivs;
          
          for (let k = 0; k < blockAttributes[attribute].meta.tags.length; k++)
            {
            if (blockAttributes[attribute].meta.tags[k].indexOf('widget') !== -1)
              {
              isWidget   = true;
              widgetType = blockAttributes[attribute].meta.tags[k].slice('widget:'.length);
              //console.log('sidePaneTabContents.generateTabContent: widgetType = '+widgetType);
              }
            
            /* Need to find what group the
             attribute belongs to as well
             */
            
            else if (blockAttributes[attribute].meta.tags[k].indexOf('group') !== -1)
              {
              
              isInAGroup    = true;
              groupName = blockAttributes[attribute].meta.tags[k].slice('group:'.length);
                
              }
            }
          
          if (isWidget === true)
            {
            
            /* Want a switch statement going through all
             the possible widget types
             */
            
            /* Also want to take into account whether or
             not the widget is part of a group, so do a check
             on isInAGroup with some sort of logic to decided
             what to 'push' to in each case
             */
            /**
             * Switch the output rendering to either groupsObject[] or blockAttributeDivs
             * by pointing widgetParent at the appropriate object.
             * IJG 6/2/17
             */
            if (isInAGroup === true)
              {
              if (groupsObject[groupName] === undefined)
                {
                groupsObject[groupName] = [];
                }
              widgetParent = groupsObject[groupName];
              }
            else
              {
              widgetParent = blockAttributeDivs;
              }
            
            /* Using JSX spread attributes to pass a common set
             of props to all widgets
             */
            
            let commonProps = {
              blockAttribute      : blockAttributes[attribute],
              blockAttributeStatus: this.state.blockAttributesIconStatus[attribute],
              blockName           : this.props.tabObject.label,
              attributeName       : attribute,
              isInAGroup          : isInAGroup,
              key                 : this.props.tabObject.label + attribute + widgetType,
              widgetType          : widgetType
            };

            if (widgetParent !== undefined)
              widgetParent.push(<WidgetTableContainer {...commonProps} />);
              
            }
            
          }
        
        /* Then here have a for loop iterating through
         the groupsObject, creating a treeview for each
         one, then handing it a nodeLabel and its child
         array with all the appropriate children
         */
          
        }
      
      for (let group in groupsObject)
        {
        blockAttributeDivs.push(
          <Treeview defaultCollapsed={true}
                    nodeLabel={<b style={{marginLeft: '-47px', fontSize: '13px'}}>{group}</b>}
                    key={group + 'treeview'}
          > {groupsObject[group]}
          </Treeview>
        )
        }
      
      return blockAttributeDivs;
        
      },
    
    render: function ()
      {
      
      console.log('sidePaneTabContents.render(): ' + this.props.tabObject.label);
      
      let tabContent = [];
      
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
      console.log(`sidePaneTabContents.render(): this.props.tabObject.tabType = ${this.props.tabObject.tabType}`);
      if (this.props.tabObject.tabType === 'VISIBILITY' ||
        this.props.tabObject.tabType === 'block')
        {
        
        /* Making the tab content generator more generic */
        
        tabContent.push(
          this.generateTabContent(this.state.blockAttributes)
        );
        }
      else if (this.props.tabObject.tabType === 'edge')
        {
        /**
         * TODO: I think that button should be Button. CHECK!!
         */
        tabContent.push(
          <Button key={this.props.tabObject.label + "edgeDeleteButton"}
                  onClick={this.handleEdgeDeleteButton.bind(null, this.props.tabObject)}
          >Delete edge</Button>
        );
        }
      
      return (
        <Content>
          {tabContent}
        </Content>
      )
      }
    
  });

module.exports = SidePaneTabContents;
