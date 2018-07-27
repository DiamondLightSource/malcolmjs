import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

import blockUtils from '../malcolm/blockUtils';

class AttributePlot extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { data, layout } = state;
    if (props.attribute && layout.datarevision !== props.attribute.plotTime) {
      data[0].x = props.attribute.timeSinceConnect;
      data[0].y = props.attribute.value;
      data[0].line = { shape: props.attribute.isBool ? 'hv' : 'linear' };
      layout.datarevision = props.attribute.plotTime;
      return { ...state, data: [...data], layout };
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          x: [],
          y: [],
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'red' },
          line: { shape: 'linear' },
        },
      ],
      layout: {
        datarevision: -1,
        autosize: true,
        // paper_bgcolor: '#4f4f4f',
        // plot_bgcolor: '#4f4f4f'
      },
    };
  }

  render() {
    return (
      <Plot
        data={this.state.data}
        layout={this.state.layout}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let attribute;
  if (ownProps.attributeName && ownProps.blockName) {
    const attributeIndex = blockUtils.findAttributeIndex(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
    if (attributeIndex !== -1) {
      attribute =
        state.malcolm.blockArchive[ownProps.blockName].attributes[
          attributeIndex
        ];
      if (
        state.malcolm.blocks[ownProps.blockName].attributes[attributeIndex].raw
          .meta &&
        state.malcolm.blocks[ownProps.blockName].attributes[attributeIndex].raw
          .meta.typeid === 'malcolm:core/BooleanMeta:1.0'
      ) {
        const boolToInt = attribute.value.map(a => (a ? 1 : 0));
        attribute = { ...attribute, value: boolToInt, isBool: true };
      }
    }
  }
  return {
    attribute,
  };
};
/*
AttributePlot.propTypes = {
  attribute: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.number),
    timeSinceConnect: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired,
};
*/
export default connect(mapStateToProps)(AttributePlot);
