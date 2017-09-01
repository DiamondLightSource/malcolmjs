/**
 * Created by Ian Gillingham on 21/06/17.
 */
//import * as React from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import {Route, Switch} from 'react-router-dom';
import Breadcrumbs from 'react-breadcrumbs';
import breadBin from '../stores/breadbin';
import styles from '../styles/breadcrumbs.scss';

export default class MjsBreadcrumbs extends Component {
  constructor(props)
  {
    super(props);
  }

  componentDidMount()
  {
    breadBin.addChangeListener(this.__onBreadcumbsChange);
  }

  componentWillUnmount()
  {}

  shouldComponentUpdate(nextProps, nextState)
  {
    let bRet = true;
    return (bRet);
  }

  __onBreadcumbsChange()
    {

    }

  render()
  {
    const breadcrumbs =
            <div className={styles.breadcrumb}>
              <a href="#" className={styles.active}>{"Browse"}</a>
              <a href="#">{"PandA 1"}</a>
              <a href="#">{"Layout"}</a>
              <a href="#">{"PULSE3"}</a>
            </div>;

    const breadcrumb_flat =
            <div className={"${styles.breadcrumb} ${styles.flat}"}>
              <a href="#" className={styles.active}>{"Browse"}</a>
              <a href="#">{"PandA 1"}</a>
              <a href="#">{"Layout"}</a>
              <a href="#">{"PULSE3"}</a>
            </div>;

    const std_breadcrumbs = <div>
      <Breadcrumbs routes={this.props.routes}
                        params={this.props.params}
                        setDocumentTitle={true}/>
          </div>;

    return (breadcrumbs);
  }
}

MjsBreadcrumbs.defaultProps = {
  cbClicked: null
};

MjsBreadcrumbs.propTypes = {
  children: PropTypes.node
};
