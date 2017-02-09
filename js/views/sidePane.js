/**
 * Created by twi18192 on 01/09/15.
 */

let React       = require('react');
let ReactDOM    = require('react-dom');
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
    skin            : React.PropTypes.object,
    globals         : React.PropTypes.number,
    tabState        : React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    selectedTabIndex: React.PropTypes.number.isRequired,
    listVisible     : React.PropTypes.bool.isRequired
  },

  shouldComponentUpdate: function (nextProps, nextState)
    {
    /* Even though all the props of sidePane will need to cause a
     rerender if changed, if I don't put shouldComponentUpdate with
     all of them in, sidePane will rerender whenever sidebar does,
     which isn't quite what I want
     */
    return (
      nextProps.selectedTabIndex !== this.props.selectedTabIndex ||
      nextProps.listVisible !== this.props.listVisible ||
      nextProps.tabState !== this.props.tabState
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

    console.log("render: sidePane");

    let skin    = this.props.skin || "default";
    let globals = this.props.globals || {};

    /* Do I need dynamicTab to be something else if tabState is empty? */

    console.log(this.props.tabState);
    console.log(this.props.selectedTabIndex);

    let dynamicTab;

    /* Should I include selectedTabIndex being < 0 too ? */
    if (this.props.tabState.length === 0)
      {
      dynamicTab = [];
      }
    else
      {
      dynamicTab =
        <Tab key={this.props.tabState[this.props.selectedTabIndex].label + 'tab'}
             title={this.props.tabState[this.props.selectedTabIndex].label}>
          <SidePaneTabContents key={this.props.tabState[this.props.selectedTabIndex].label + 'contents'}
                               tabObject={this.props.tabState[this.props.selectedTabIndex]}/>
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
                             listVisible={this.props.listVisible}
                   />
                 </div>
               </Button>
             ]}>
        {dynamicTab}
      </Panel>
    );
    }
});

module.exports = SidePane;
