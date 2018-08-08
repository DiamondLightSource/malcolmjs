import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import blockUtils from '../malcolm/blockUtils';

import ArchiveTable from './archiveTable.container';
import AttributePlot from './attributePlot.component';
// import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

class AttributeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: props.defaultTab,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      `--------------- ${nextProps.openPanels.child !==
        this.props.openPanels.child ||
        nextProps.openPanels.parent !== this.props.openPanels.parent}`
    );
    return (
      nextState.tabValue !== this.state.tabValue ||
      nextProps.attribute.plotTime !== this.props.attribute.plotTime ||
      nextProps.blockName !== this.props.blockName ||
      nextProps.attributeName !== this.props.attributeName ||
      nextProps.openPanels.child !== this.props.openPanels.child ||
      nextProps.openPanels.parent !== this.props.openPanels.parent
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
    const { attribute, theme } = this.props;
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
          <ArchiveTable attribute={attribute} />
          <AttributePlot
            attribute={attribute}
            openPanels={this.props.openPanels}
          />
        </SwipeableViews>
        <Tabs
          value={tabValue}
          onChange={this.handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          centered
          fullWidth
        >
          <Tab label="Plot" disabled={disablePlotView} />
          <Tab label="Table" />
        </Tabs>
      </div>
    ) : (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ height: 'calc(100% - 50px)' }}>
          {tabValue === 1 && <ArchiveTable attribute={attribute} />}
          {tabValue === 0 && (
            <AttributePlot
              attribute={attribute}
              openPanels={this.props.openPanels}
            />
          )}
        </div>
        <Tabs
          value={tabValue}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          fullWidth
        >
          <Tab label="Plot" disabled={disablePlotView} />
          <Tab label="Table" />
        </Tabs>
      </div>
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
    }
  }
  return {
    attribute,
  };
};

AttributeViewer.propTypes = {
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
  attribute: PropTypes.shape({
    refreshRate: PropTypes.number,
    value: PropTypes.arrayOf(PropTypes.number),
    timeSinceConnect: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired,
  // widgetTag: PropTypes.string.isRequired,
  // typeId: PropTypes.string.isRequired,
  useSwipeable: PropTypes.bool,
  defaultTab: PropTypes.number,
  openPanels: PropTypes.shape({
    parent: PropTypes.bool,
    child: PropTypes.bool,
  }).isRequired,
};

AttributeViewer.defaultProps = {
  defaultTab: 0,
  useSwipeable: false,
};

export default connect(mapStateToProps)(withTheme()(AttributeViewer));
