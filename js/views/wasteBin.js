/**
 * Created by ig43 on 03/10/16.
 */
import * as React from 'react';
//import ActionDelete from 'material-ui/svg-icons/action/delete';
//import {red500, yellow500, blue500} from 'material-ui/styles/colors';

const iconStyles = {
  marginRight: 24,
};


/*
 * @class WasteBin
 * @extends React.Component
 */
export default class WasteBin extends React.Component {
constructor(props)
  {
  super(props);
  this.state = {};
  }

/*
 * @method shouldComponentUpdate
 * @returns {Boolean}
 */
shouldComponentUpdate()
  {
  // Just return false until there is some meat on the bones.
  return (false);
  }

/*
 * @method render
 * @returns {JSX}
 */
render()
  {
  //return <ActionDelete style={iconStyles} color={red500}/>;
  }
}

WasteBin.propTypes    = {};
WasteBin.defaultProps = {};
