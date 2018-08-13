import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import Plot from 'react-plotly.js';
// import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { MalcolmTickArchive } from '../malcolm/malcolm.types';
import { ARCHIVE_REFRESH_INTERVAL } from '../malcolm/reducer/malcolmReducer';

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
  dataElement.y = attribute.plotValue
    .toarray()
    .map(
      (value, valIndex) =>
        alarms[valIndex] === alarmStatesByIndex[alarmIndex] ||
        alarms[valIndex - 1] === alarmStatesByIndex[alarmIndex]
          ? value
          : null
    );
  dataElement.x.push(dataElement.x.slice(-1)[0]);
  dataElement.y.push(dataElement.y.slice(-1)[0]);
  dataElement.visible = dataElement.y.some(val => val !== null);
  /*
  dataElement.line = {
    ...dataElement.line,
    shape: attribute.meta.typeid === malcolmTypes.number ? 'linear' : 'hv',
  }; */
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

    this.renderTimeout = setTimeout(() => {}, 4000);

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

  componentWillUnmount() {
    clearTimeout(this.renderTimeout);
  }

  render() {
    clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(() => {
      this.props.tickArchive([
        this.props.attribute.parent,
        this.props.attribute.name,
      ]);
    }, 1100 * ARCHIVE_REFRESH_INTERVAL);

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

const mapStateToProps = () => {};

const mapDispatchToProps = dispatch => ({
  tickArchive: path => {
    dispatch({
      type: MalcolmTickArchive,
      payload: { path },
    });
  },
});

AttributePlot.propTypes = {
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
  */
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
  tickArchive: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(AttributePlot)
);
