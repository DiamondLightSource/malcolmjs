import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Plot from 'react-plotly.js';
import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

class AttributePlot extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { data, layout } = state;
    if (props.attribute && layout.datarevision !== props.attribute.plotTime) {
      data[0].x = props.attribute.timeSinceConnect.toarray();
      data[0].y = props.attribute.plotValue.toarray();
      data[0].line = {
        shape: props.attribute.typeid === malcolmTypes.bool ? 'hv' : 'linear',
      };
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
          marker: { color: props.theme.palette.primary.light },
          line: { shape: 'linear' },
        },
      ],
      layout: {
        datarevision: -1,
        autosize: true,
        paper_bgcolor: props.theme.palette.background.paper,
        plot_bgcolor: props.theme.palette.background.paper,
        xaxis: {
          color: emphasize(props.theme.palette.background.paper, 0.8),
        },
        yaxis: {
          color: emphasize(props.theme.palette.background.paper, 0.8),
        },
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

AttributePlot.propTypes = {
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
    }),
  }).isRequired,
  /*
  attribute: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.number),
    timeSinceConnect: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired,
  */
};

export default withTheme()(AttributePlot);
