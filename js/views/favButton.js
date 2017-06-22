/**
 * Created by twi18192 on 25/08/15.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

let ButtonStyle = {
  backgroundColor: 'grey',
  height         : 25,
  width          : 70,
  borderRadius   : 8,
  borderStyle    : 'solid',
  borderWidth    : 1,
  borderColor    : 'black',
  fontFamily     : 'Verdana',
  //    color: 'white',
  textAlign      : 'center',
  display        : 'inline-block',
  cursor         : 'pointer',
  MozUserSelect  : 'none',
  position       : 'relative',
  marginTop      : '39px'

};

let ButtonTitlePadding = {
  position: 'relative',
  top     : -6

};

//function getFavButtonState(){
//  return{
//    favPanelOpen: mainPaneStore.getFavPanelState()
//  }
//}

export default class FavButton extends React.Component
{
  constructor(props)
    {
    super(props);
    this._onChange = this._onChange.bind(this);
    this.handleActionFavToggle = this.handleActionFavToggle.bind(this);
    }
  
  _onChange ()
    {
    //this.setState(getFavButtonState)
    }

  handleActionFavToggle ()
    {
    //mainPaneActions.toggleFavPanel("this is the item");
    this.props.favTabOpen()
    }

  componentDidMount ()
    {
    //mainPaneStore.addChangeListener(this._onChange)
    }

  componentWillUnmount ()
    {
    //mainPaneStore.removeChangeListener(this._onChange)
    }

  render ()
    {
    return (
      <div>
        <div id="fav" style={ButtonStyle} onClick={this.handleActionFavToggle}><span
          style={ButtonTitlePadding}> Fav</span>

        </div>

      </div>
    );
    }

}

FavButton.propTypes = {
favTabOpen      : PropTypes.func
};
