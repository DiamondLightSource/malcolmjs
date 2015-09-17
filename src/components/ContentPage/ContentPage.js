/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import './ContentPage.less';
import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars

class ContentPage {

  static propTypes = {
    body: PropTypes.string.isRequired
  };

  render() {
    var { className, body, other } = this.props;

    return (
      <div className={'ContentPage ' + className}
        dangerouslySetInnerHTML={{__html: body}} {...other} />
    );
  }

}

export default ContentPage;
