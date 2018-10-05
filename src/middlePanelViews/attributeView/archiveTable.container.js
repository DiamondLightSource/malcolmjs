import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WidgetTable from '../../malcolmWidgets/table/virtualizedTable.component';
import { ARCHIVE_REFRESH_INTERVAL } from '../../malcolm/reducer/malcolmReducer';
import blockUtils from '../../malcolm/blockUtils';

const noOp = () => {};

class ArchiveTable extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (
      props.attribute.plotTime - state.renderTime >
      ARCHIVE_REFRESH_INTERVAL
    ) {
      return { renderTime: props.attribute.plotTime };
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.state = { renderTime: -1 };
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.attribute.plotTime - this.state.renderTime >
        ARCHIVE_REFRESH_INTERVAL ||
      nextProps.attribute.parent !== this.props.attribute.parent ||
      nextProps.attribute.name !== this.props.attribute.name
    );
  }
  render() {
    const { attribute } = this.props;
    return (
      <WidgetTable
        attribute={{
          raw: {
            value: {
              timeStamp: attribute.timeStamp
                .toarray()
                .slice(0, -1)
                .map(date => date.toISOString()),
              value: attribute.value.toarray(), // .slice(-100),
              alarm: attribute.alarmState.toarray().slice(0, -1),
            },
            meta: {
              elements: {
                alarm: {
                  tags: ['info:alarm'],
                  label: ' ',
                },
                timeStamp: {
                  tags: ['widget:textupdate'],
                  label: 'Time set',
                },
                value: {
                  tags: ['widget:textupdate'],
                  label: 'Value',
                },
              },
            },
          },
          calculated: {},
        }}
        hideInfo
        eventHandler={noOp}
        setFlag={noOp}
        addRow={noOp}
        infoClickHandler={noOp}
        rowClickHandler={noOp}
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
    }
  }
  return {
    attribute,
  };
};

ArchiveTable.propTypes = {
  attribute: PropTypes.shape({
    parent: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.number),
    timeSinceConnect: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStateToProps)(ArchiveTable);
