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
import {Typography, ListItem, ListItemText, Button, Icon, Divider, List, withStyles, Toolbar, IconButton} from 'material-ui';
import Collapse from 'material-ui/transitions/Collapse';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import DNDPaletteSelector from './dndPaletteSelector';
import ItemTypes from './dndItemTypes';
import WidgetLine from './widgetLine';
import WidgetTextInput from './widgetTextInput';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  drawer: {
    width: theme.size.drawer,
    overflowX: "hidden",
    marginBottom: document.getElementById('root').getAttribute("data-nav-height")
  },
  palette: {
    display: "flex",
    flexWrap: "wrap"
  },
});


class SidePane extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {method_expanded: {}};
  }

  __onChange = () => {
    if (this.props.tabObject.label !== "Palette") {
      this.setState({
        allBlockAttributesIconStatus: attributeStore.getAllBlockAttributesIconStatus()
      });
    }
  };

  componentDidMount()
  {
    attributeStore.addChangeListener(this.__onChange);
  }

  componentWillUnmount()
  {
    attributeStore.removeChangeListener(this.__onChange);
  }

  getWidgetTags(meta) {
    let ret = {
      widgetType: null,
      groupName: null
    };

    for (let k = 0; k < meta.tags.length; k++) {
      let tag = meta.tags[k];
      if (tag.indexOf('widget') !== -1) {
        // We found a "widget:<name>" tag
        ret.widgetType = tag.slice('widget:'.length);
      }
      else if (tag.indexOf('group') !== -1) {
        // We found a "group:<name>" tag
        ret.groupName = tag.slice('group:'.length);
      }
    }

    return ret;
  }

  generateTabContent(blockAttributes, blockAttributesIconStatus) {
    // Write the current value to Malcolm
    let blockItem = blockCollection.getBlockItemByName(this.props.tabObject.label);
    let blockAttributeDivs = [];
    let {tabObject, classes} = this.props;
    let ret = {
      title: <Typography type="subheading" className={classes.flex}>{tabObject.label}</Typography>,
      contents: blockAttributeDivs,
    };

    let groupsObject = {};

    for (let attributeName in blockAttributes) {

      if (!blockAttributes.hasOwnProperty(attributeName)) continue;

      let attribute = blockAttributes[attributeName];
      let widgetParent = blockAttributeDivs;

      if (attribute.typeid === 'malcolm:core/Method:1.0') {
        // Make a method
        let takes = attribute.takes.elements;
        let keys = Object.keys(takes);
        if (attribute.method_parameters === undefined) {
          attribute.method_parameters = {};
        }
        if (keys.length > 0) {
          // Need a widget group
          groupsObject[attributeName] = [];
          widgetParent = groupsObject[attributeName];
          for (let i=0; i<keys.length; i++) {
            let paramName = keys[i];
            let tags = this.getWidgetTags(takes[paramName]);
            if (attribute.method_parameters[paramName] === undefined) {
              attribute.method_parameters[paramName] = {
                meta: takes[paramName],
                value: null
              };
            }
            widgetParent.push(
              <WidgetLine
                blockAttribute={attribute.method_parameters[paramName]}
                blockAttributeStatus={blockAttributesIconStatus[attributeName]}
                blockName={this.props.tabObject.label}
                attributeName={"*" + paramName}
                widgetType={tags.widgetType}
                key={attributeName + paramName + attribute.method_parameters[paramName].value}
              />
            );
          }
        } else {
          let tags = this.getWidgetTags(attribute);
          if (tags.groupName) {
            if (groupsObject[tags.groupName] === undefined) {
              groupsObject[tags.groupName] = [];
            }
            widgetParent = groupsObject[tags.groupName];
          }
        }
        // Put in a button
        widgetParent.push(
          <WidgetLine
            blockAttribute={attribute}
            blockAttributeStatus={blockAttributesIconStatus[attributeName]}
            blockName={this.props.tabObject.label}
            attributeName={attributeName}
            widgetType="method"
            key={attributeName}
          />
        )
      } else if (MalcolmUtils.hasOwnNestedProperties(attribute, "meta", "tags")) {
        // Make an attribute
        let tags = this.getWidgetTags(attribute.meta);
        if (tags.groupName) {
          if (groupsObject[tags.groupName] === undefined) {
            groupsObject[tags.groupName] = [];
          }
          widgetParent = groupsObject[tags.groupName];
        }

        if (tags.widgetType === "title") {
          ret.title = (
            <WidgetTextInput
              blockName={tabObject.label}
              attributeName={attributeName}
              blockAttribute={attribute}
              blockAttributeValue={attribute.value}
              className={classes.flex}
            />
          );
        } else if (tags.widgetType !== "icon" && tags.widgetType !== "group") {
          widgetParent.push(
            <WidgetLine
              blockAttribute={attribute}
              blockAttributeStatus={blockAttributesIconStatus[attributeName]}
              blockName={this.props.tabObject.label}
              attributeName={attributeName}
              widgetType={tags.widgetType}
              key={attributeName + attribute.value}
            />
          );
        }
      }
    }

    if (blockAttributeDivs.length > 0 && Object.keys(groupsObject).length > 0) {
      // We have some widgets in the top section, and some groups, so put a divider in
      blockAttributeDivs.push(
        <Divider light key={"ungrouped_and_grouped_divider"}/>
      );
    }

    for (let groupName in groupsObject) {
      let group = blockAttributes[groupName];
      let label;
      let expanded;
      let onClick;
      if (MalcolmUtils.hasOwnNestedProperties(group, "meta")) {
        // Attribute group
        label = group.meta.label;
        expanded = group.value === "expanded";
        onClick = (e) => {
          MalcolmActionCreators.malcolmPut([blockItem.mri(), groupName, "value"], expanded)
        }
      } else {
        // Method group
        label = group.label;
        expanded = this.state.method_expanded[groupName] !== false;
        onClick = (e) => {
          let method_expanded = {...this.state.method_expanded};
          method_expanded[groupName] = method_expanded[groupName] === false;
          this.setState({"method_expanded": method_expanded})
        };
      }
      blockAttributeDivs.push(
        <ListItem button onClick={onClick} key={groupName + "listitem"}>
          <ListItemText primary={label}/>
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

  handleEdgeDeleteButton = (EdgeInfo) => {

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
    MalcolmActionCreators.malcolmPut(endpoint, argumentValue);
  };

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
        <ListItem>
          <Button raised onClick={this.handleEdgeDeleteButton}>
            Delete edge
          </Button>
        </ListItem>
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
      //console.log("Show palette");
      title = <Typography type="subheading" className={classes.flex}>Palette</Typography>;

      let blockItems = blockCollection.getAllBlockItems();
      let blockNames = [];
      for (let i = 0; i < blockItems.length; i++) {
        if (blockItems[i].blockName() !== "")
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


