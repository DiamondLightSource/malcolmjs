/**
 * Created by Ian Gillingham on 30/08/17.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import theme from '../styles/mjsLayout.scss';

export default class MjsBottomBar extends Component {
  constructor(props)
  {
    super(props);
  }

  componentDidMount()
  {
  }

  componentWillUnmount()
  {}

  shouldComponentUpdate(nextProps, nextState)
  {
    let bRet = true;
    return (bRet);
  }

  render()
  {
    return (
      <div className={theme.bottombar}>
        <span>{"This navbar intentionally blank"}</span>
      </div>
    );
  }
}

MjsBottomBar.defaultProps = {
  cbClicked: null
};

MjsBottomBar.propTypes = {
  children: PropTypes.node
};
