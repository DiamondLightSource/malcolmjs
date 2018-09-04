import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Plot from 'react-plotly.js';
import { AlarmStates } from '../attributeDetails/attributeAlarm/attributeAlarm.component';

const alarmStatesByIndex = [
  AlarmStates.NO_ALARM,
  AlarmStates.MINOR_ALARM,
  AlarmStates.MAJOR_ALARM,
  AlarmStates.UNDEFINED_ALARM,
];

const updatePlotData = (oldDataElement, alarmIndex, attribute) => {
  const dataElement = oldDataElement;
  const alarms = attribute.alarmState.toarray();
  dataElement.x = attribute.timeStamp.toarray();
  dataElement.y = attribute.Value.toarray().map(
    (value, valIndex) =>
      alarms[valIndex] === alarmStatesByIndex[alarmIndex] ||
      (alarms[valIndex - 1] === alarmStatesByIndex[alarmIndex] &&
        alarms[valIndex] !== AlarmStates.UNDEFINED_ALARM)
        ? value
        : null
  );
  dataElement.x.push(dataElement.x.slice(-1)[0]);
  dataElement.y.push(dataElement.y.slice(-1)[0]);
  dataElement.visible = dataElement.y.some(val => val !== null);
  return dataElement;
};

class MethodPlot extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { data, layout } = state;
    const dataRevision = `${props.attribute.parent}#${props.attribute.name}#${
      props.attribute.plotTime
    }#p:${props.openPanels.parent}#c:${props.openPanels.child}`;
    const newData = data.map((dataElement, index) =>
      updatePlotData(dataElement, index, props.attribute)
    );
    layout.datarevision = dataRevision;
    if (
      props.attribute.parent !== layout.parent ||
      props.attribute.name !== layout.attribute
    ) {
      layout.parent = props.attribute.parent;
      layout.attribute = props.attribute.name;
      layout.yaxis = {
        color: props.theme.palette.text.primary,
      };
    }
    return {
      ...state,
      data: [...newData],
      layout,
    };
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
          line: { shape: 'hv' },
          name: 'Normal',
          visible: false,
        },
        {
          x: [],
          y: [],
          type: 'scatter',
          mode: 'lines+points',
          marker: {
            color: props.theme.alarmState.warning,
          },
          line: { shape: 'hv', dash: '15px, 5px' },
          name: 'Minor',
          visible: false,
        },
        {
          x: [],
          y: [],
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: props.theme.alarmState.error },
          line: { shape: 'hv', dash: '10px, 10px' },
          name: 'Major',
          visible: false,
        },
        {
          x: [],
          y: [],
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: props.theme.alarmState.disconnected },
          line: { shape: 'hv', dash: '5px, 15px' },
          name: 'Disconnected',
          visible: false,
        },
      ],
      layout: {
        parent: '',
        attribute: '',
        legend: { font: { color: props.theme.palette.text.primary } },
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

MethodPlot.propTypes = {
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      text: PropTypes.shape({
        primary: PropTypes.string,
      }),
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      background: PropTypes.shape({
        default: PropTypes.string,
      }),
    }),
    alarmState: PropTypes.shape({
      warning: PropTypes.string,
      error: PropTypes.string,
      disconnected: PropTypes.string,
    }),
  }).isRequired,
  /*
  openPanels: PropTypes.shape({
    parent: PropTypes.bool,
    child: PropTypes.bool,
  }).isRequired,
  attribute: PropTypes.shape({
    parent: PropTypes.string,
    name: PropTypes.string,
    meta: PropTypes.shape({
      choices: PropTypes.arrayOf(PropTypes.string),
    }),
    value: PropTypes.arrayOf(PropTypes.number),
    timeStamp: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired,
  */
};

export default withTheme()(MethodPlot);
