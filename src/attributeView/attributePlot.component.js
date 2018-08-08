import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Plot from 'react-plotly.js';
import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';

const alarmStatesByIndex = [
  AlarmStates.NO_ALARM,
  AlarmStates.MINOR_ALARM,
  AlarmStates.MAJOR_ALARM,
  AlarmStates.UNDEFINED_ALARM,
];

const updatePlotData = (oldDataElement, alarmIndex, attribute) => {
  const dataElement = oldDataElement;
  dataElement.x = attribute.timeStamp.toarray();
  dataElement.y = attribute.plotValue
    .toarray()
    .map(
      (value, valIndex) =>
        attribute.alarmState.toarray()[valIndex] ===
        alarmStatesByIndex[alarmIndex]
          ? value
          : null
    );
  dataElement.line = {
    ...dataElement.line,
    shape: attribute.meta.typeid === malcolmTypes.number ? 'linear' : 'hv',
  };
  return dataElement;
};

class AttributePlot extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { data, layout } = state;
    const dataRevision = `${props.attribute.parent}#${props.attribute.name}#${
      props.attribute.plotTime
    }#p:${props.openPanels.parent}#c:${props.openPanels.child}`;
    if (props.attribute && layout.datarevision !== dataRevision) {
      const newData = data.map((dataElement, index) =>
        updatePlotData(dataElement, index, props.attribute)
      );
      layout.datarevision = dataRevision;
      return { ...state, data: [...newData], layout };
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
          title: 'Normal',
        },
        {
          x: [],
          y: [],
          type: 'scatter',
          mode: 'lines+points',
          marker: {
            color: props.theme.alarmState
              ? props.theme.alarmState.warning
              : '#fff',
          },
          line: { shape: 'linear' },
          title: 'Minor',
        },
        {
          x: [],
          y: [],
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: props.theme.palette.error.main },
          line: { shape: 'linear' },
          title: 'Major',
        },
        {
          x: [],
          y: [],
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: props.theme.palette.primary.dark },
          line: { shape: 'linear', dash: 'dash' },
          title: 'Disconnected',
        },
      ],
      layout: {
        datarevision: -1,
        autosize: true,
        paper_bgcolor: props.theme.palette.background.default,
        plot_bgcolor: props.theme.palette.background.default,
        xaxis: {
          color: props.theme.palette.text.primary,
        },
        yaxis: {
          color: props.theme.palette.text.primary,
        },
      },
    };
    /* CODE FOR DISPLAYING POSSIBLE VALUES FOR ENUM ON Y AXIS (DISABLED)
    if (props.attribute.meta.choices) {
      this.state.layout.yaxis = {
        ...this.state.layout.yaxis,
        tickvals: props.attribute.meta.choices.map((val, index) => index),
        ticktext: props.attribute.meta.choices,
        range: [0, props.attribute.meta.choices.length - 1],
      };
    } */
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
      text: PropTypes.shape({
        primary: PropTypes.string,
      }),
      primary: PropTypes.shape({
        light: PropTypes.string,
        dark: PropTypes.string,
      }),
      error: PropTypes.shape({
        main: PropTypes.string,
      }),
      background: PropTypes.shape({
        default: PropTypes.string,
      }),
    }),
    alarmState: PropTypes.shape({
      warning: PropTypes.string,
    }),
  }).isRequired,
  /*
  openPanels: PropTypes.shape({
    parent: PropTypes.bool,
    child: PropTypes.bool,
  }).isRequired,
  attribute: PropTypes.shape({
    meta: PropTypes.shape({
      choices: PropTypes.arrayOf(PropTypes.string),
    }),
    value: PropTypes.arrayOf(PropTypes.number),
    timeSinceConnect: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired, */
};

export default withTheme()(AttributePlot);
