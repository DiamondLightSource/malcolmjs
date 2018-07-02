import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import { selectorFunction } from '../attributeDetails/attributeSelector/attributeSelector.component';

export const getTableWidgetTags = attribute =>
  attribute.labels.map(label => {
    const { tags } = attribute.meta.elements[label];
    const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
    if (widgetTagIndex !== -1) {
      return tags[widgetTagIndex];
    }
    return -1;
  });

const TableWidgetSelector = props => {
  const isDisabled = false;
  const isErrorState = false;
  const isDirty = true;
  const forceUpdate = false;
  const continuousSend = true;
  return selectorFunction(
    props.columnWidgetTag,
    props.rowPath,
    props.value,
    props.rowChangeHandler,
    {
      isDisabled,
      isErrorState,
      isDirty,
    },
    props.setFlag,
    props.theme.palette.primary.light,
    props.columnMeta,
    forceUpdate,
    continuousSend
  );
};

TableWidgetSelector.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  columnWidgetTag: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        main: PropTypes.string,
      }),
    }),
  }).isRequired,
  rowChangeHandler: PropTypes.func.isRequired,
  rowPath: PropTypes.shape({
    label: PropTypes.string,
    row: PropTypes.number,
  }).isRequired,
  columnMeta: PropTypes.shape({}).isRequired,
  setFlag: PropTypes.func.isRequired,
};

export default withTheme()(TableWidgetSelector);
