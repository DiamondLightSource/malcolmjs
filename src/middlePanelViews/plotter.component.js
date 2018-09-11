import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import Plot from 'react-plotly.js/react-plotly';
import { MalcolmTickArchive } from '../malcolm/malcolm.types';
import { ARCHIVE_REFRESH_INTERVAL } from '../malcolm/reducer/malcolmReducer';

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
        // && newState.data[0].x.slice(-1)[0] instanceof Date) {
        const USER_HAS_CHANGED_LAYOUT =
          state.layout.xaxis.range &&
          (!(state.layout.xaxis.range[0] instanceof Date) ||
            !(state.layout.xaxis.range[1] instanceof Date));
        if (!USER_HAS_CHANGED_LAYOUT) {
          newState.layout.xaxis = {
            ...newState.layout.xaxis,
            range: [
              new Date(newState.data[0].x.slice(-1)[0].getTime() - 30000),
              newState.data[0].x.slice(-1)[0],
            ],
          };
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
      },
      userChangingViewState: false,
    };
    this.startChangingViewState = this.startChangingViewState.bind(this);
    this.finishChangingViewState = this.finishChangingViewState.bind(this);
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
      thisPlot.removeEventListener('mousedown');
      thisPlot.removeEventListener('mouseup');
    }
  }

  startChangingViewState() {
    this.setState({ userChangingViewState: true });
  }

  finishChangingViewState() {
    this.setState({
      ...this.props.deriveState(this.props, this.state),
      userChangingViewState: false,
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
      />
    );
  }
}

const mapStateToProps = () => ({});

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
};

Plotter.defaultProps = {
  doTick: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(Plotter)
);
