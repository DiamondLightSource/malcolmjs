/**
 * Created by twi18192 on 01/09/15.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import blockStore from '../stores/blockStore';
import blockCollection from '../classes/blockItems';
import attributeStore from '../stores/attributeStore';
import MalcolmUtils from '../utils/MalcolmUtils';
import appConstants from '../constants/appConstants';
import {Typography, ListItem, ListItemText, Button, Icon, Divider, withStyles, Toolbar, IconButton} from 'material-ui';
import Collapse from 'material-ui/transitions/Collapse';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import DNDPaletteSelector from './dndPaletteSelector';
import ItemTypes from './dndItemTypes';
import WidgetTableContainer from './widgetLine';
import WidgetTextInput from './widgetTextInput';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  drawer: {
    width: theme.size.drawer,
    overflowX: "hidden"
  },
  palette: {
    display: "flex",
    flexWrap: "wrap"
  },
});


class SidePane extends React.Component {

  generateTabContent(blockAttributes, blockAttributesIconStatus) {
    let blockAttributeDivs = [];
    let {tabObject, classes} = this.props;
    let ret = {
      title: <Typography type="subheading" className={classes.flex}>{tabObject.label}</Typography>,
      contents: blockAttributeDivs,
    };

    let groupsObject = {};

    for (let attribute in blockAttributes) {

      if (!blockAttributes.hasOwnProperty(attribute)) continue;

      if ((MalcolmUtils.hasOwnNestedProperties(blockAttributes[attribute], "meta", "tags") === undefined) &&
        (blockAttributes[attribute].alarm === undefined)) {

        /* Creating the array that I'll push the
         treeview children to as the upper for loop
         goes through all the attributes of the block
         */
        groupsObject[attribute] = [];

      }
      else if (MalcolmUtils.hasOwnNestedProperties(blockAttributes[attribute], "meta", "tags")) {
        let groupName;
        let isWidget = false;
        let widgetType;
        let isInAGroup = false;
        let widgetParent = blockAttributeDivs;

        for (let k = 0; k < blockAttributes[attribute].meta.tags.length; k++) {
          if (blockAttributes[attribute].meta.tags[k].indexOf('widget') !== -1) {
            isWidget = true;
            widgetType = blockAttributes[attribute].meta.tags[k].slice('widget:'.length);
            //console.log('sidePaneTabContents.generateTabContent: widgetType = '+widgetType);
          }

          /* Need to find what group the
           attribute belongs to as well
           */

          else if (blockAttributes[attribute].meta.tags[k].indexOf('group') !== -1) {

            isInAGroup = true;
            groupName = blockAttributes[attribute].meta.tags[k].slice('group:'.length);

          }
        }

        if (isWidget === true) {

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
          if (isInAGroup === true) {
            if (groupsObject[groupName] === undefined) {
              groupsObject[groupName] = [];
            }
            widgetParent = groupsObject[groupName];
          }

          /* Using JSX spread attributes to pass a common set
           of props to all widgets
           */

          let commonProps = {
            blockAttribute: blockAttributes[attribute],
            blockAttributeStatus: blockAttributesIconStatus[attribute],
            blockName: this.props.tabObject.label,
            attributeName: attribute,
            isInAGroup: isInAGroup,
            key: this.props.tabObject.label + attribute + widgetType,
            widgetType: widgetType
          };

          if (widgetType === "title") {
            ret.title = (
              <WidgetTextInput
                blockName={tabObject.label}
                attributeName={attribute}
                blockAttributeValue={blockAttributes[attribute].value}
                className={classes.flex}
              />
            );
          } else if (widgetParent !== undefined) {
            widgetParent.push(
              <WidgetTableContainer {...commonProps}/>);
          }
        }
      }
    }

    // This is the correct way to iterate through the array of attributes
    // and constructing the TreeView
    //const label2 = <span className="node">{blockAttribs}</span>;
    for (let groupName in groupsObject) {
      let group = blockAttributes[groupName];
      let expanded = group.value === "expanded";
      blockAttributeDivs.push(
        <ListItem button onClick={(e) =>
          MalcolmActionCreators.malcolmAttributeValueEdited(
            this.props.tabObject.label, groupName, expanded)
        } key={groupName + "listitem"}>
          <ListItemText primary={group.meta.label}/>
          { expanded ? <Icon color="action">expand_less</Icon> : <Icon color="action">expand_more</Icon>}
        </ListItem>
      );
      blockAttributeDivs.push(
        <Collapse in={expanded} transitionDuration="auto" unmountOnExit
                  key={groupName + "collapse"}>
          {groupsObject[groupName]}
        </Collapse>
      );
      blockAttributeDivs.push(
        <Divider light key={groupName + "divider"}/>
      );
    }
    return ret;
  }

  handleEdgeDeleteButton(EdgeInfo) {

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
    
    const {tabObject} = this.props;

    for (let i = 0; i < allBlockInfo[tabObject.toBlock].inports.length;
         i++) {
      //console.log(blockStore.getAllBlockInfo()[EdgeInfo.toBlock].inports[i].connectedTo);
      let blockinfo = allBlockInfo[tabObject.toBlock];
      let inport = blockinfo.inports[i];

      if (inport.connectedTo !== null &&
        inport.connectedTo.block === tabObject.fromBlock &&
        inport.connectedTo.port === tabObject.fromBlockPort) {
        if ((inport.type === appConstants.MALCOLM_TYPE_BOOL) || (inport.type === appConstants.MALCOLM_TYPE_INT32)) {
          argumentValue = appConstants.MALCOLM_VALUE_ZERO;
        }
      }
    }
    // TODO: this is wrong, toBlock and fromBlock should be fully qualified names
    let endpoint = [MalcolmActionCreators.getdeviceId() + ":" + tabObject.toBlock, tabObject.toBlockPort, "value"];
    MalcolmActionCreators.malcolmPut(EdgeInfo.toBlock, endpoint, argumentValue);
  }

  render() {
    const {classes, tabObject, areAnyBlocksSelected, areAnyEdgesSelected,
      onClose} = this.props;

    let title;
    let contents;

    if (areAnyEdgesSelected) {
      // Show an edge delete button
      console.log("Show edges");
      title = <Typography type="subheading" className={classes.flex}>{tabObject.label}</Typography>;
      contents = (
        <Button onClick={this.handleEdgeDeleteButton}>
          Delete edge
        </Button>
      )
    } else if (areAnyBlocksSelected) {
      // Show the blocks details
      console.log("Show block" + tabObject.label);
      let ret = this.generateTabContent(
        attributeStore.getAllBlockAttributes()[tabObject.label],
        attributeStore.getAllBlockAttributesIconStatus()[tabObject.label]);
      title = ret.title;
      contents = ret.contents;
    } else {
      // Show the block list
      console.log("Show palette");
      title = <Typography type="subheading" className={classes.flex}>Palette</Typography>;

      let blockItems = blockCollection.getAllBlockItems();
      let blockNames = [];
      for (let i = 0; i < blockItems.length; i++) {
        blockNames.push(blockItems[i].blockName());
      }
      blockNames.sort();

      let blockList = blockNames.map(
        (blockName) => (
          <DNDPaletteSelector connectDragSource={ItemTypes.PALETTE}
                              isDragging={true}
                              name={blockName}
                              key={blockName + 'dragBlockDNDSel'}
          />
        )
      );
      contents = <div className={classes.palette}>{blockList}</div>
    }
    return (
      <div className={classes.drawer}>
        <Toolbar disableGutters>
          <IconButton onClick={onClose}>close</IconButton>
          {title}
          {/*<IconButton>open_in_new</IconButton>*/}
        </Toolbar>
        {contents}
      </div>
    );
  }
}

SidePane.propTypes = {
  classes: PropTypes.object.isRequired,
  tabObject: PropTypes.object,
  areAnyBlocksSelected: PropTypes.bool.isRequired,
  areAnyEdgesSelected: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(SidePane);


