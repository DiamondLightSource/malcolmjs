/**
 * Created by twi18192 on 01/09/15.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import sidePaneActions from '../actions/sidePaneActions';
//import paneStore from '../stores/paneStore';
import interact from 'interactjs';
export default class Dropdown extends React.Component
{
  constructor(props)
    {
    super(props);
    this.handleActionShow = this.handleActionShow.bind(this);
    this.handleActionHide = this.handleActionHide.bind(this);
    }

  shouldComponentUpdate(nextProps, nextState)
    {
    return (
      (nextProps.listVisible !== this.props.listVisible) ||
      (nextProps.tabState !== this.props.tabState)
      /* You can alter tabState with the dropdown list
       visible, so you still need to redraw if tabState
       changes
       */
    )
    }

  handleActionShow(e)
    {
    console.log(e);
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (this.props.tabState.length === 0)
      {
      console.log("tabState is empty, so there are no tabs, so don't show the dropdown menu");
      }
    else if (this.props.tabState.length > 0)
      {
      console.log("tabState wasn't empty, so go ahead and show the dropdown menu");
      sidePaneActions.dropdownMenuShow("This is the item");
      //document.addEventListener("click", this.handleActionHide)

      interact('#container')
      //interact(this.refs.dropdowncontainer)
        .on('tap', this.handleActionHide);
      }

    }

  handleActionHide(e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();
    console.log(arguments);
    sidePaneActions.dropdownMenuHide("This is the item");
    //document.removeEventListener("click", this.handleActionHide)

    interact('#container')
      .off('tap', this.handleActionHide);
    }

  testSelectInvokeSidePane(item)
    {
    this.props.changeTab(item);
    console.log("inside testSelectInvokeSidePane");
    }

  componentDidMount()
    {
    console.log("dropdown is mounted");
    //sidePaneStore.addChangeListener(this._onChange);

    //interact('.dropdown-display')
    //  .on('tap', this.handleActionShow)

    interact('#dropdownButton')
      .on('tap', this.handleActionShow)
    }

  componentWillUnmount()
    {
    //sidePaneStore.removeChangeListener(this._onChange);
    console.log("dropdown is unmounting");

    //interact('.dropdown-display')
    //  .off('tap', this.handleActionShow)

    interact('#dropdownButton')
    //interact(this.refs.dropdownbutton)
      .off('tap', this.handleActionShow);

    interact('#container')
      .off('tap', this.handleActionHide);
    }

  //renderListItems: function() {
  //  let items = [];
  //  for (let i = 0; i < this.props.tabState.length; i++) {
  //    let item = this.props.tabState[i].label;
  //    let interactIdString = "#" + "dropdownTab" + item;
  //
  //    items.push(
  //      <div key={item + "-tab"} id={"dropdownTab" + item} className="dropdownTab">
  //        <span >{item}</span>
  //      </div>
  //    );
  //
  //    interact(interactIdString)
  //      .on('tap', this.testSelectInvokeSidePane.bind(null, item));
  //  }
  //
  //  return items;
  //},

  render()
    {

    let items = [];
    let item = "";
    let interactIdString = "";

    for (let i = 0; i < this.props.tabState.length; i++)
      {
      if (this.props.tabState[i].label !== undefined)
        {
        item             = this.props.tabState[i].label;
        //console.log(item);
        interactIdString = "#" + "dropdownTab" + item;
        }
      else if (this.props.tabState[i].label === undefined)
        {
        window.alert("tabState[i].label is undefined");
        item             = this.props.tabState[i];
        //console.log(item);
        interactIdString = "#" + "dropdownTab" + item;
        }
      //console.log(interactIdString);

      items.push(
        <div key={item + "-tab"} id={"dropdownTab" + item} className={"dropdownTab"}>
          <span >{item}</span>
        </div>
      );

      interact(interactIdString)
        .on('tap', (e) =>
          {
          e.stopPropagation();
          e.stopImmediatePropagation();
          //console.log("dropdownMenu item click");
          //console.log(item);
          this.testSelectInvokeSidePane(item);
          this.handleActionHide(e);
          });
      //console.log(document.getElementById("dropdownTab" + item));
      }

    return (
      <div className={"dropdown-container" + (this.props.listVisible ? " handleActionShow" : "")} >
        <div className={"dropdown-display" + (this.props.listVisible ? " clicked" : "")} id={"dropdownButton"}
          //onClick={this.handleActionShow}
        >
          <span ></span>
          <i className={"fa fa-angle-down"}></i>
        </div>
        <div className={"dropdown-list"}>
          <div>
            {items}
          </div>
        </div>
      </div>
    )

    }
}

Dropdown.propTypes = {
listVisible: PropTypes.bool,
  tabState   : PropTypes.arrayOf(PropTypes.object),
  changeTab  : PropTypes.func
};

