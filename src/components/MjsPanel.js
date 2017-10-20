/**
 * Created by Ian Gillingham on 21/06/17.
 */
//import * as React from 'react';
import React,{ Component} from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';

/**
 * react-toolbox: Container
Name	    Default	Type	Description
as		    {custom} An element type to render as (string or function).
children	{node} Primary content.
className	{string} Additional classes.
fluid		  {bool} Container has no maximum width.
text		  {bool} Reduce maximum width to more naturally accommodate text.
textAlign	{enum} Align container text. Enums:left center right justified
 **/

export default class MjsPanel extends Component {
constructor(props)
  {
  super(props);
  }

componentDidMount()
  {
  }

componentWillUnmount()
  {
  }

shouldComponentUpdate(nextProps, nextState)
  {
  let bRet = true;
  return (bRet);
  }


render()
  {
  const style = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
  };

  const children = this.props.children;
  //return (<Container>{children}</Container> );
  return (<div id="SidePaneContainerDiv" style={{overflowY:"overlay"}}>{children}</div>);
  }
}


MjsPanel.defaultProps = {cbClicked: null};

MjsPanel.propTypes =
{
  theme               : PropTypes.string,
  useAvailableHeight  : PropTypes.bool,
  children            : PropTypes.node
};


