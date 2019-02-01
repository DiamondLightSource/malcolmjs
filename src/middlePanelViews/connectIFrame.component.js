import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Iframe from 'react-iframe';
import blockUtils from '../malcolm/blockUtils';

const ConnectedIFrame = props => (
  <Iframe url={props.attribute.raw.value} width="100%" height="100%" />
);

const mapStateToProps = (state, ownProps) => {
  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    ownProps.blockName,
    ownProps.attributeName
  );

  return {
    attribute,
  };
};

ConnectedIFrame.propTypes = {
  attribute: PropTypes.shape({
    raw: PropTypes.shape({
      meta: PropTypes.shape({
        tags: PropTypes.arrayOf(PropTypes.string),
        choices: PropTypes.arrayOf(PropTypes.string),
        writeable: PropTypes.bool,
      }),
      path: PropTypes.arrayOf(PropTypes.string),
      value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.string,
        PropTypes.shape({}),
      ]),
      pending: PropTypes.bool,
      errorState: PropTypes.bool,
      dirty: PropTypes.bool,
      alarm: PropTypes.shape({
        severity: PropTypes.number,
      }),
    }),
  }).isRequired,
};

export default connect(mapStateToProps)(withTheme()(ConnectedIFrame));
