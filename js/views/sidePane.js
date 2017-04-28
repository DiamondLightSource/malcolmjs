/**
 * Created by twi18192 on 01/09/15.
 */

let React       = require('react');
let ReactDOM    = require('react-dom');
import PropTypes from 'prop-types';
let ReactPanels = require('react-panels');
let Dropdown    = require('./dropdownMenu');

let Panel  = ReactPanels.Panel;
let Tab    = ReactPanels.Tab;
let Button = ReactPanels.Button;

let paneActions = require('../actions/paneActions');

let SidePaneTabContents = require('./sidePaneTabContents');

let SidePane;
SidePane = React.createClass({

  propTypes: {
    skin            : PropTypes.object,
    globals         : PropTypes.number,
    tabState        : PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedTabIndex: PropTypes.number.isRequired,
    listVisible     : PropTypes.bool.isRequired,
    areAnyBlocksSelected   : PropTypes.bool,
    areAnyEdgesSelected    : PropTypes.bool
  },

  shouldComponentUpdate: function (nextProps, nextState)
    {
    /* Even though all the props of sidePane will need to cause a
     rerender if changed, if I don't put shouldComponentUpdate with
     all of them in, sidePane will rerender whenever sidebar does,
     which isn't quite what I want
     */
    return (
      nextProps.selectedTabIndex     !== this.props.selectedTabIndex    ||
      nextProps.listVisible          !== this.props.listVisible         ||
      nextProps.tabState             !== this.props.tabState            ||
      nextProps.areAnyEdgesSelected  !== this.props.areAnyEdgesSelected ||
      nextProps.areAnyBlocksSelected !== this.props.areAnyBlocksSelected
    )
    },

  handleActionTabChangeViaOtherMeans: function (tab)
    {
    paneActions.dropdownMenuSelect(tab);
    },

  handleActionRemoveBlockTab: function ()
    {
    paneActions.removeBlockTab("this is the item");
    },

  componentDidMount: function ()
    {
    console.log('SidePane.componentDidMount(): ');
    console.log(this.refs);
    //debugger;
    ReactDOM.findDOMNode(this).addEventListener('keydown', this.disableTabKey);
    },

  componentWillUnmount: function ()
    {
    ReactDOM.findDOMNode(this).removeEventListener('keydown', this.disableTabKey);
    },

  disableTabKey: function (e)
    {
    console.log(e);
    if (e.keyCode === 9)
      {
      console.log("tab key!");
      e.preventDefault();
      }
    },

  render: function ()
    {
    //console.log("render: sidePane");

    let skin    = this.props.skin || "default";
    let globals = this.props.globals || {};

    /* Do I need dynamicTab to be something else if tabState is empty? */

    console.log(`SidePane: tabState = ${this.props.tabState}`);
    console.log(`SidePane: selectedTabIndex = ${this.props.selectedTabIndex}`);

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
        dynamicTab = <Tab key={title + 'tab'}
                      title={title}>
                      <SidePaneTabContents key={title + 'contents'}
                           tabObject={this.props.tabState[this.props.selectedTabIndex]}
                           areAnyBlocksSelected={this.props.areAnyBlocksSelected}
                           areAnyEdgesSelected={this.props.areAnyEdgesSelected}/>
                      </Tab>;
      }

    return (
      <Panel theme="flexbox"
             skin={skin} useAvailableHeight={true}
             globals={globals}
             buttons={[

               <Button title="Remove active tab"
                       onButtonClick={this.handleActionRemoveBlockTab}>
                 <i className="fa fa-times"></i>
               </Button>,
               <Button title="Drop down menu">
                 <div id="dropDown">
                   <Dropdown changeTab={this.handleActionTabChangeViaOtherMeans}
                             tabState={this.props.tabState}
                             listVisible={this.props.listVisible}>
                     </Dropdown>
                 </div>
               </Button>
             ]}>
        {dynamicTab}
      </Panel>
    );
    }
});

module.exports = SidePane;
