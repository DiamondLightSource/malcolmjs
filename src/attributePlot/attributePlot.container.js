import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

import blockUtils from '../malcolm/blockUtils';

const AttributePlot = props => {
  if (props.attribute && props.attribute.archive) {
    return (
      <Plot
        data={[
          {
            x: props.attribute.archive.timeStamps,
            y: props.attribute.archive.values,
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'red' },
          },
        ]}
        // layout={{paper_bgcolor: '#4f4f4f', plot_bgcolor: '#4f4f4f'}}
      />
    );
  }

  return null;
};

const mapStateToProps = (state, ownProps) => {
  let attribute;
  if (ownProps.attributeName && ownProps.blockName) {
    attribute = blockUtils.findAttribute(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
  }
  return {
    attribute,
  };
};

AttributePlot.propTypes = {
  attribute: PropTypes.shape({
    archive: PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.number),
      timeStamps: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
};

export default connect(mapStateToProps)(AttributePlot);
