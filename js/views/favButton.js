/**
 * Created by twi18192 on 25/08/15.
 */

var React = require('react');
var mainPaneStore = require('../stores/mainPaneStore');
var mainPaneActions = require('../actions/mainPaneActions');

var ButtonStyle = {
  backgroundColor: 'grey',
  height: 25,
  width: 70,
  borderRadius: 8,
  borderStyle:'solid',
  borderWidth: 1,
  borderColor: 'black',
  fontFamily: 'Verdana',
//    color: 'white',
  textAlign: 'center',
  display: 'inline-block',
  cursor: 'pointer',
  MozUserSelect: 'none',
  position: 'relative',
  marginTop: '39px'

};

var ButtonTitlePadding = {
  position: 'relative',
  top: -6

};

//function getFavButtonState(){
//  return{
//    favPanelOpen: mainPaneStore.getFavPanelState()
//  }
//}

var FavButton = React.createClass({
  //getInitialState: function(){
  //  return getFavButtonState();
  //},

  _onChange: function(){
    //this.setState(getFavButtonState)
  },

  handleActionFavToggle: function(){
    //mainPaneActions.toggleFavPanel("this is the item");
    this.props.favTabOpen()
  },

  componentDidMount: function(){
    //mainPaneStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function(){
    //mainPaneStore.removeChangeListener(this._onChange)
  },

  render: function(){
    return(
      <div>
        <div id="fav" style={ButtonStyle} onClick={this.handleActionFavToggle} ><span style={ButtonTitlePadding}> Fav</span>

        </div>

      </div>
    );
  }

});

module.exports = FavButton;
