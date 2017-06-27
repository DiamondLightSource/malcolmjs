/**
 * Created by twi18192 on 01/09/15.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
//import ReactPanels from 'react-panels';
import Dropdown from './dropdownMenu';

//let Panel  = ReactPanels.Panel;
//let Tab    = ReactPanels.Tab;
//let Button = ReactPanels.Button;

import paneActions from '../actions/paneActions';
import SidePaneTabContents from './sidePaneTabContents';
import MjsPanel from '../components/MjsPanel';
import Tabs from 'react-toolbox/lib/tabs/Tabs';
import Tab from 'react-toolbox/lib/tabs/Tab';
import {Button} from 'semantic-ui-react';
//import Button from 'react-toolbox/lib/button/Button';

export default class SidePane extends React.Component {
constructor(props)
  {
  super(props);
  this.disableTabKey                      = this.disableTabKey.bind(this);
  this.handleActionTabChangeViaOtherMeans = this.handleActionTabChangeViaOtherMeans.bind(this);
  this.handleActionRemoveBlockTab         = this.handleActionRemoveBlockTab.bind(this);
  this.handleTabChange                    = this.handleTabChange.bind(this);

  this.state =
  {
    index       : 1,
    fixedIndex  : 1,
    inverseIndex: 1
  };
  }

shouldComponentUpdate(nextProps, nextState)
  {
  /* Even though all the props of sidePane will need to cause a
   rerender if changed, if I don't put shouldComponentUpdate with
   all of them in, sidePane will rerender whenever sidebar does,
   which isn't quite what I want
   */
  return (
    nextProps.selectedTabIndex !== this.props.selectedTabIndex ||
    nextProps.listVisible !== this.props.listVisible ||
    nextProps.tabState !== this.props.tabState ||
    nextProps.areAnyEdgesSelected !== this.props.areAnyEdgesSelected ||
    nextProps.areAnyBlocksSelected !== this.props.areAnyBlocksSelected
  )
  }

handleTabChange(index)
  {
  this.setState({index});
  }

handleActionTabChangeViaOtherMeans(tab)
  {
  paneActions.dropdownMenuSelect(tab);
  }

handleActionRemoveBlockTab()
  {
  paneActions.removeBlockTab("this is the item");
  }

componentDidMount()
  {
  ReactDOM.findDOMNode(this).addEventListener('keydown', this.disableTabKey);
  }

componentWillUnmount()
  {
  ReactDOM.findDOMNode(this).removeEventListener('keydown', this.disableTabKey);
  }

disableTabKey(e)
  {
  if (e.keyCode === 9)
    {
    e.preventDefault();
    }
  }

render()
  {
  let skin    = this.props.skin || "default";
  let globals = this.props.globals || {};

  /* Do I need dynamicTab to be something else if tabState is empty? */

  let dynamicTab;

  /* Should I include selectedTabIndex being < 0 too ? */
  if (this.props.tabState.length === 0)
    {
    dynamicTab = [];
    }
  else
    {
    /***
     * If any block is selected then use its name (via tabState[n].label)
     * in the Tab title.
     * Otherwise assum no blocks selected and set the Tab title to
     * indicate that we are displaying the list of available blocks.
     *
     */
    let title;
    if (!(this.props.areAnyBlocksSelected || this.props.areAnyEdgesSelected))
      {
      title = "Blocks Available";
      }
    else
      {
      title = this.props.tabState[this.props.selectedTabIndex].label;
      }
    //dynamicTab = <Tab key={title + 'tab'}
    //                label={title}>
    dynamicTab = <SidePaneTabContents key={title + 'contents'}
                                      tabObject={this.props.tabState[this.props.selectedTabIndex]}
                                      areAnyBlocksSelected={this.props.areAnyBlocksSelected}
                                      areAnyEdgesSelected={this.props.areAnyEdgesSelected}/>;
    //</Tab>;
    }

    return (
      <MjsPanel theme="flexbox" useAvailableHeight={true}>
        <Button label="Remove active tab"
                onClick={this.handleActionRemoveBlockTab}
                key={"rat1"}
                icon={"remove"}
                attached={"top"}>
        </Button>
        <Button label="Block details"
                key={"drm1"}
                icon={"dropdown"}
                attached={"top"}>

          <div id="dropDown">
            <Dropdown changeTab={this.handleActionTabChangeViaOtherMeans}
                      tabState={this.props.tabState}
                      listVisible={this.props.listVisible}>
            </Dropdown>
          </div>
        </Button>
        {dynamicTab}

      </MjsPanel>
    );
  }
}

SidePane.propTypes = {
  skin                : PropTypes.object,
  globals             : PropTypes.number,
  tabState            : PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTabIndex    : PropTypes.number.isRequired,
  listVisible         : PropTypes.bool.isRequired,
  areAnyBlocksSelected: PropTypes.bool,
  areAnyEdgesSelected : PropTypes.bool
};
