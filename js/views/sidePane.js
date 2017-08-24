/**
 * Created by twi18192 on 01/09/15.
 */

import * as React from 'react';
//import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
//import ReactPanels from 'react-panels';
import Dropdown from './dropdownMenu';

//let Panel  = ReactPanels.Panel;
//let Tab    = ReactPanels.Tab;
//let Button = ReactPanels.Button;

import paneActions from '../actions/paneActions';
import SidePaneTabContents from './sidePaneTabContents';
import Tabs from 'react-toolbox/lib/tabs/Tabs';
import Tab from 'react-toolbox/lib/tabs/Tab';
import Button from 'react-toolbox/lib/button/Button';
import styles from '../styles/sidePaneContent.css';

export default class DlsSidePane extends React.Component {
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
  this.tabcontent.addEventListener('keydown', this.disableTabKey);
  }

componentWillUnmount()
  {
  this.tabcontent.removeEventListener('keydown', this.disableTabKey);
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

    dynamicTab =
        <SidePaneTabContents key={title + 'contents'}
                                        tabObject={this.props.tabState[this.props.selectedTabIndex]}
                                        areAnyBlocksSelected={this.props.areAnyBlocksSelected}
                                        areAnyEdgesSelected={this.props.areAnyEdgesSelected}/>;
    }



    let renderSimple = <div className={styles.RightSidebar} ref={(node) => {this.tabcontent = node}}>{dynamicTab}</div>;

  return ( renderSimple );
  }
}

DlsSidePane.propTypes = {
  skin                : PropTypes.object,
  globals             : PropTypes.number,
  tabState            : PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTabIndex    : PropTypes.number.isRequired,
  listVisible         : PropTypes.bool.isRequired,
  areAnyBlocksSelected: PropTypes.bool,
  areAnyEdgesSelected : PropTypes.bool
};
