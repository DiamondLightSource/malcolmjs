import React from 'react';
import PropTypes from 'prop-types';
import WidgetTable from '../malcolmWidgets/table/table.component';

class ArchiveTable extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.attribute.plotTime - state.renderTime > 5) {
      return { renderTime: props.attribute.plotTime };
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.state = { renderTime: -1 };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.attribute.plotTime - this.state.renderTime > 5;
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
                .slice(-100)
                .map(date => date.toISOString()),
              value: attribute.value.toarray().slice(-100),
            },
            meta: {
              elements: {
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
        eventHandler={() => {}}
        setFlag={() => {}}
        addRow={() => {}}
        infoClickHandler={() => {}}
        rowClickHandler={() => {}}
      />
    );
  }
}

ArchiveTable.propTypes = {
  attribute: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.number),
    timeSinceConnect: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired,
};

export default ArchiveTable;