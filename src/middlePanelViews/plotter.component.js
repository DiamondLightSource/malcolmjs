import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import Plot from 'react-plotly.js/react-plotly';
import { timeFormat } from 'd3-time-format';
import { MalcolmTickArchive } from '../malcolm/malcolm.types';
import { ARCHIVE_REFRESH_INTERVAL } from '../malcolm/reducer/malcolmReducer';
import blockUtils from '../malcolm/blockUtils';

export const plotlyDateFormatter = timeFormat('%Y-%m-%d %H:%M:%S.%L');

export const comparePlotlyDateString = (date1, date2) => {
  // plotly.js sometimes adds or removes decimal places in the millisecond portion of its stringified date
  // so we take that in to account when comparing two dates
  if (
    date1 instanceof Date ||
    date2 instanceof Date ||
    typeof date1 !== 'string' ||
    typeof date2 !== 'string'
  ) {
    return false;
  }
  const date1Split = date1.split('.');
  const date2Split = date2.split('.');
  const date1Millis =
    date1Split[1] === undefined
      ? 0
      : parseFloat(`0.${date1Split[1].slice(0, 3)}`);
  const date2Millis =
    date2Split[1] === undefined
      ? 0
      : parseFloat(`0.${date2Split[1].slice(0, 3)}`);
  return date1Split[0] === date2Split[0] && date1Millis === date2Millis;
};

const returnedToInitialXRange = state =>
  state.layout.xaxis.range &&
  comparePlotlyDateString(
    state.layout.xaxis.range[0],
    state.originalXRange[0]
  ) &&
  comparePlotlyDateString(state.layout.xaxis.range[1], state.originalXRange[1]);

const initialiseData = (color, name, dash) => ({
  x: [],
  y: [],
  type: 'scatter',
  mode: 'lines+points',
  marker: { color },
  line: { shape: 'hv', dash },
  name,
  visible: false,
});

class Plotter extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!state.userChangingViewState) {
      const newState = props.deriveState(props, state);
      if (props.attribute) {
        // const userHasChangedLayout =
        //   /* this relies on the fact that plotly.js accepts JS Date objects for axis range values,
        //   but changes them to strings when it sets the range itself (i.e. when the user pans or zooms)
        //    */
        //   state.layout.xaxis.range &&
        //   (!(state.layout.xaxis.range[0] instanceof Date) ||
        //     !(state.layout.xaxis.range[1] instanceof Date));
        if (
          newState.data[0] &&
          newState.data[0].x.length > 0 &&
          !state.userHasChangedLayout
        ) {
          newState.layout.xaxis = {
            ...newState.layout.xaxis,
            range: !props.useRaw
              ? [
                  new Date(newState.data[0].x.slice(-1)[0].getTime() - 30000),
                  newState.data[0].x.slice(-1)[0],
                ]
              : [newState.data[0].x[0], newState.data[0].x.slice(-1)[0]],
          };
        }
        if (!state.originalXRange && newState.layout.xaxis.range) {
          newState.originalXRange = newState.layout.xaxis.range.map(date =>
            plotlyDateFormatter(date)
          );
        }
      }
      return newState;
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [
        initialiseData(props.theme.palette.primary.light, 'Normal'),
        initialiseData(props.theme.alarmState.warning, 'Warning', '15px, 5px'),
        initialiseData(props.theme.alarmState.error, 'Major', '10px, 10px'),
        initialiseData(
          props.theme.alarmState.disconnected,
          'Disconnected',
          '5px, 15px'
        ),
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
        yaxis2: {
          color: props.theme.palette.text.primary,
          overlaying: 'y',
          side: 'right',
        },
        margin: { l: 40, r: 30, t: 30, b: 30 },
      },
      userChangingViewState: false,
      userHasChangedLayout: false,
      init: true,
    };
    this.startChangingViewState = this.startChangingViewState.bind(this);
    this.finishChangingViewState = this.finishChangingViewState.bind(this);
    this.resetAxes = this.resetAxes.bind(this);
    this.renderTimeout = setTimeout(() => {}, 4000);
  }

  componentDidMount() {
    const thisPlot = document.getElementById('plotComponent');
    if (thisPlot !== null) {
      thisPlot.addEventListener('mousedown', this.startChangingViewState);
      thisPlot.addEventListener('mouseup', this.finishChangingViewState);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.renderTimeout);
    const thisPlot = document.getElementById('plotComponent');
    if (thisPlot !== null) {
      thisPlot.removeEventListener('mousedown', this.startChangingViewState);
      thisPlot.removeEventListener('mouseup', this.finishChangingViewState);
    }
  }

  startChangingViewState() {
    this.setState({ ...this.state, userChangingViewState: true });
  }

  finishChangingViewState() {
    if (returnedToInitialXRange(this.state)) {
      this.resetAxes();
      /* Due to issues in overriding the plotly modebar buttons,
       we instead check and relayout action to see if it was a reset axes action
       (e.g. the range limits for the x axes are set to the stringified version of their original values)
       */
    } else {
      // remove flag and force data state to update from props
      this.setState({
        ...this.props.deriveState(this.props, this.state),
        userChangingViewState: false,
        userHasChangedLayout: !this.state.init,
        init: false,
      });
    }
  }

  resetAxes() {
    this.setState({
      ...this.state,
      userChangingViewState: false,
      userHasChangedLayout: false,
      layout: {
        ...this.state.layout,
        datarevision: this.state.layout.datarevision + 1,
        xaxis: {
          color: this.props.theme.palette.text.primary,
          range: !this.props.useRaw
            ? [
                new Date(this.state.data[0].x.slice(-1)[0].getTime() - 30000),
                this.state.data[0].x.slice(-1)[0],
              ]
            : [this.state.data[0].x[0], this.state.data[0].x.slice(-1)[0]],
        },
        yaxis: {
          color: this.props.theme.palette.text.primary,
          autorange: true,
        },
      },
    });
  }

  render() {
    if (this.props.doTick) {
      clearTimeout(this.renderTimeout);
      this.renderTimeout = setTimeout(() => {
        this.props.tickArchive([
          this.props.attribute.parent,
          this.props.attribute.name,
        ]);
      }, 1100 * ARCHIVE_REFRESH_INTERVAL);
    }
    return (
      <Plot
        data={this.state.data}
        layout={this.state.layout}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
        onRelayout={this.finishChangingViewState}
        divId="plotComponent"
        data-cy="plotter"
      />
    );
  }
}

const mapStateToProps = (state, ownProps, memory) => {
  const plotterMemory = memory;
  let attribute;
  if (ownProps.attribute) {
    return {
      attribute: ownProps.attribute,
      parentPanelOpen: state.viewState.openParentPanel,
      childPanelOpen: state.malcolm.childBlock !== undefined,
    };
  }
  if (ownProps.attributeName && ownProps.blockName) {
    const attributeIndex = blockUtils.findAttributeIndex(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
    if (attributeIndex !== -1) {
      attribute = !ownProps.useRaw
        ? state.malcolm.blockArchive[ownProps.blockName].attributes[
            attributeIndex
          ]
        : state.malcolm.blocks[ownProps.blockName].attributes[attributeIndex];
    }
  }

  if (
    !plotterMemory.currentPlotAttribute ||
    attribute.plotTime !== plotterMemory.currentPlotAttribute.plotTime ||
    ownProps.useRaw
  ) {
    plotterMemory.currentPlotAttribute = attribute;
  }

  return {
    attribute: plotterMemory.currentPlotAttribute,
    parentPanelOpen: state.viewState.openParentPanel,
    childPanelOpen: state.malcolm.childBlock !== undefined,
  };
};

const mapDispatchToProps = dispatch => ({
  tickArchive: path => {
    dispatch({
      type: MalcolmTickArchive,
      payload: { path },
    });
  },
});

Plotter.propTypes = {
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
  doTick: PropTypes.bool,
  deriveState: PropTypes.func.isRequired,
  useRaw: PropTypes.bool,
};

Plotter.defaultProps = {
  doTick: false,
  useRaw: false,
};

const memoizedMapStateToProps = () => {
  const plotterMemory = {
    currentPlotAttribute: undefined,
  };

  return (state, ownProps) => mapStateToProps(state, ownProps, plotterMemory);
};

export default connect(memoizedMapStateToProps, mapDispatchToProps)(
  withTheme()(Plotter)
);
