import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: 500,
  },
  heading: {
    padding: 4,
  },
});

const WidgetGroupExpander = props => (
  <div className={props.classes.div}>
    <ExpansionPanel defaultExpanded={props.expanded}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={props.classes.heading}>
          {props.groupName}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className={props.classes.div}>{props.children}</div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

WidgetGroupExpander.propTypes = {
  expanded: PropTypes.bool,
  groupName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    heading: PropTypes.string,
  }).isRequired,
};

WidgetGroupExpander.defaultProps = {
  expanded: false,
};

export const GroupExpanderComponent = WidgetGroupExpander;
export default withStyles(styles, { withTheme: true })(WidgetGroupExpander);
