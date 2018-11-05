import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

class TabbedPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: props.defaultTab,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.plotTime !== this.props.plotTime ||
      nextState.tabValue !== this.state.tabValue ||
      nextProps.blockName !== this.props.blockName ||
      nextProps.attributeName !== this.props.attributeName ||
      nextProps.childPanelOpen !== this.props.childPanelOpen ||
      nextProps.parentPanelOpen !== this.props.parentPanelOpen ||
      this.props.alwaysUpdate ||
      nextProps.alwaysUpdate
    );
  }

  handleChange(event, tabValue) {
    this.setState({ tabValue });
  }

  handleChangeIndex(tabValue) {
    this.setState({ tabValue });
  }

  render() {
    const { tabValue } = this.state;
    const { theme } = this.props;
    const disablePlotView = false; /* !(
      ['widget:led', 'widget:checkbox', 'widget:combo'].includes(
        this.props.widgetTag
      ) ||
      (['widget:textupdate', 'widget:textinput'].includes(
        this.props.widgetTag
      ) &&
        [malcolmTypes.bool, malcolmTypes.number].includes(this.props.typeId))
    ); */

    return this.props.useSwipeable ? (
      <div style={{ width: '100%', height: '100%' }}>
        <SwipeableViews
          style={{ height: 'calc(100% - 50px)', overflowY: 'visible' }}
          containerStyle={{ height: '100%', overflowY: 'visible' }}
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.tabValue}
          onChangeIndex={this.handleChangeIndex}
        >
          {this.props.children}
        </SwipeableViews>
        <Tabs
          value={tabValue}
          onChange={this.handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          centered
          fullWidth
        >
          <Tab label={this.props.tabLabels[0]} />
          <Tab label={this.props.tabLabels[1]} disabled={disablePlotView} />
        </Tabs>
      </div>
    ) : (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ height: 'calc(100% - 50px)' }}>
          {tabValue === 0 && this.props.children[0]}
          {tabValue === 1 && this.props.children[1]}
        </div>
        <Tabs
          value={tabValue}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          fullWidth
        >
          <Tab label={this.props.tabLabels[0]} />
          <Tab
            label={this.props.tabLabels[1]}
            disabled={disablePlotView}
            data-cy="plotTab"
          />
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  useSwipeable: false,
  parentPanelOpen: state.viewState.openParentPanel,
  childPanelOpen: state.malcolm.childBlock !== undefined,
});

TabbedPanel.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
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
  useSwipeable: PropTypes.bool,
  defaultTab: PropTypes.number,
  childPanelOpen: PropTypes.bool.isRequired,
  parentPanelOpen: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  plotTime: PropTypes.number,
  alwaysUpdate: PropTypes.bool,
  tabLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

TabbedPanel.defaultProps = {
  defaultTab: 1,
  useSwipeable: false,
  plotTime: 0,
  alwaysUpdate: false,
};

export default connect(mapStateToProps)(withTheme()(TabbedPanel));
