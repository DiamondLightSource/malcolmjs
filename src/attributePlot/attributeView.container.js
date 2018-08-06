import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import blockUtils from '../malcolm/blockUtils';

import ArchiveTable from '../malcolmWidgets/table/archiveTable.container';
import AttributePlot from './attributePlot';
// import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

class AttributeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
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
          <AttributePlot attribute={attribute} />
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
          {tabValue === 0 && <AttributePlot attribute={attribute} />}
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
    value: PropTypes.arrayOf(PropTypes.number),
    timeSinceConnect: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired,
  // widgetTag: PropTypes.string.isRequired,
  // typeId: PropTypes.string.isRequired,
  useSwipeable: PropTypes.bool,
};

AttributeViewer.defaultProps = {
  useSwipeable: false,
};

export default connect(mapStateToProps)(withTheme()(AttributeViewer));
