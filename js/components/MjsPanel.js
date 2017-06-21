/**
 * Created by Ian Gillingham on 21/06/17.
 */
import * as React from 'react';
import { Component, PropTypes } from 'react';
import * as ReactDOM from 'react-dom';
import {Container} from 'semantic-ui-react';

/**
 * semantic-ui: Container
Name	    Default	Type	Description
as		    {custom} An element type to render as (string or function).
children	{node} Primary content.
className	{string} Additional classes.
fluid		  {bool} Container has no maximum width.
text		  {bool} Reduce maximum width to more naturally accommodate text.
textAlign	{enum} Align container text. Enums:left center right justified
 **/

class MjsPanel extends Component {
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
  let bRet = false;
  return (bRet);
  }


render()
  {
  }
}


MjsPanel.defaultProps = {cbClicked: null};

MjsPanel.propTypes =
{
  theme               : PropTypes.string,
  useAvailableHeight  : PropTypes.bool,
  buttons             : PropTypes.object,
};


export default MjsPanel;
