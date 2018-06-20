import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { selectorFunction } from '../attributeDetails/attributeSelector/attributeSelector.component';

const styles = () => ({
  missingAttribute: {
    color: 'red',
  },
});

export const getWidgetTags = attribute =>
  attribute.labels.map(label => {
    const { tags } = attribute.meta.elements[label];
    const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
    if (widgetTagIndex !== -1) {
      return tags[widgetTagIndex];
    }
    return -1;
  });

const WidgetSelector = props => {
  const setDisabled = false;
  const isErrorState = false;
  return selectorFunction(
    props.columnWidgetTag,
    props.value,
    setDisabled,
    isErrorState,
    props.rowChangeHandler,
    props.rowPath,
    {
      colorLED: props.theme.palette.primary.light,
      missingAttribute: props.classes.missingAttribute,
    },
    props.columnMeta
  );
};

WidgetSelector.propTypes = {
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
  classes: PropTypes.shape({
    missingAttribute: PropTypes.string,
  }).isRequired,
  rowChangeHandler: PropTypes.func.isRequired,
  rowPath: PropTypes.shape({
    label: PropTypes.string,
    row: PropTypes.number,
  }).isRequired,
  columnMeta: PropTypes.shape({}).isRequired,
};

export default withStyles(styles, { withTheme: true })(WidgetSelector);
