/**
 * Created by twi18192 on 01/09/15.
 */

var React = require('react');
var sidePaneStore = require('../stores/sidePaneStore');
var sidePaneActions = require('../actions/sidePaneActions');

var paneStore = require('../stores/paneStore');

var interact = require('../../node_modules/interact.js');

//function getDropdownState(){
//  return{
//    listVisible: sidePaneStore.getDropdownState(),
//    tabState: paneStore.getTabState(),
//    selectedTabIndex: paneStore.getSelectedTabIndex()
//  }
//}


var Dropdown = React.createClass({

  //getInitialState: function() {
  //  return getDropdownState();
  //},

  _onChange: function(){
    //this.setState(getDropdownState())
  },

  shouldComponentUpdate: function(nextProps, nextState){
    return (
      nextProps.listVisible !== this.props.listVisible ||
      nextProps.tabState !== this.props.tabState ||
      nextProps.changeTab !== this.props.changeTab
    )
  },

  handleActionShow: function(e){
    console.log(e);
    e.stopImmediatePropagation();
    e.stopPropagation();
    if(this.props.tabState.length === 0){
      console.log("tabState is empty, so there are no tabs, so don't show the dropdown menu");
    }
    else if(this.props.tabState.length > 0){
      console.log("tabState wasn't empty, so go ahead and show the dropdown menu");
      sidePaneActions.dropdownMenuShow("This is the item");
      //document.addEventListener("click", this.handleActionHide)

      interact('#container')
        .on('tap', this.handleActionHide);
    }

  },

  handleActionHide: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();
    console.log(arguments);
    sidePaneActions.dropdownMenuHide("This is the item");
    //document.removeEventListener("click", this.handleActionHide)

    interact('#container')
      .off('tap', this.handleActionHide);
  },

  testSelectInvokeSidePane: function(item){
    this.props.changeTab(item);
    console.log("inside testSelectInvokeSidePane");
  },

  componentDidMount: function(){
    console.log("dropdown is mounted");
    //sidePaneStore.addChangeListener(this._onChange);

    //interact('.dropdown-display')
    //  .on('tap', this.handleActionShow)

    interact('#dropdownButton')
      .on('tap', this.handleActionShow)
  },

  componentWillUnmount: function(){
    //sidePaneStore.removeChangeListener(this._onChange);
    console.log("dropdown is unmounting");

    //interact('.dropdown-display')
    //  .off('tap', this.handleActionShow)

    interact('#dropdownButton')
      .off('tap', this.handleActionShow);

    interact('#container')
      .off('tap', this.handleActionHide);
  },

  renderListItems: function() {
    var items = [];
    for (var i = 0; i < this.props.tabState.length; i++) {
      var item = this.props.tabState[i].label;
      var interactIdString = "#" + "dropdownTab" + item;

      items.push(<div key={item + "-tab"} id={"dropdownTab" + item} className="dropdownTab"
                      //onClick={this.testSelectInvokeSidePane.bind(null, item)}
      >
        <span >{item}</span>
      </div>);

      //interact(interactIdString)
      //  .on('tap',
      //    function(e){
      //      //e.stopImmediatePropagation();
      //      //e.stopPropagation();
      //      this.testSelectInvokeSidePane.bind(null, item);
      //      console.log(e);
      //      console.log(this);
      //      console.log(this.testSelectInvokeSidePane.bind(null, item));
      //    }.bind(this)
      //  );

      /* Works, but gets increasingly slow the more you select from it */
      //interact(interactIdString)
      //  .on('tap', this.testSelectInvokeSidePane.bind(null, item));

      interact(interactIdString)
        .on('tap', this.testSelectInvokeSidePane.bind(null, item));
    }

    return items;
  },

  render: function(){

    var items = [];
    for (var i = 0; i < this.props.tabState.length; i++) {
      if(this.props.tabState[i].label !== undefined) {
        var item = this.props.tabState[i].label;
        console.log(item);
        var interactIdString = "#" + "dropdownTab" + item;
      }
      else if(this.props.tabState[i].label === undefined){
        var item = this.props.tabState[i];
        console.log(item);
        var interactIdString = "#" + "dropdownTab" + item;
      }
      console.log(interactIdString);

      items.push(<div key={item + "-tab"} id={"dropdownTab" + item} className="dropdownTab"
        //onClick={this.testSelectInvokeSidePane.bind(null, item)}
      >
        <span >{item}</span>
      </div>);

      //interact(interactIdString)
      //  .on('tap', this.testSelectInvokeSidePane.bind(null, item));

      interact(interactIdString)
        .on('tap', function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log("dropdownMenu item click");
        console.log(item);
        this.testSelectInvokeSidePane(item);
        this.handleActionHide(e);
      }.bind(this));
      console.log(document.getElementById("dropdownTab" + item));
    }

    return <div className={"dropdown-container" + (this.props.listVisible ? " handleActionShow" : "")}>
      <div className={"dropdown-display" + (this.props.listVisible ? " clicked": "")} id="dropdownButton"
           //onClick={this.handleActionShow}
      >
        <span ></span>
        <i className="fa fa-angle-down"></i>
      </div>
      <div className="dropdown-list">
        <div>
          {items}
        </div>
      </div>
    </div>;

  }
});

module.exports = Dropdown;


//handleActionDropdownSelect: function(item){
//  sidePaneActions.dropdownMenuSelect(item);
//  this.props.changeTab(this.state.selectedTabIndex);
//  //this.handleActionReactPanelSelect()
//},
//
//handleActionReactPanelSelect: function(){
//  sidePaneActions.reactPanelSelect("this is the item")
//},



//select: function(item) {
//  var test = item;
//  console.log(item);
//
//  for(var i = 0; i < this.props.list.length; i++){
//    if(this.props.list[i].name === item){
//      var findTheIndex = i
//    }
//  }
//  //
//  //var findTheIndex = this.props.list.indexOf(item);
//  this.props.changeTab(findTheIndex)
//},
