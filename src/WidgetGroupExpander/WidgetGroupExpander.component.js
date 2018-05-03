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
    maxWidth: 200,
  },
  Heading: {
    padding: 4,
  },
});

const WidgetGroupExpander = props => (
  <div className={props.classes.div}>
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={props.classes.Heading}>
          {props.GroupName}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div>{props.children}</div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

WidgetGroupExpander.propTypes = {
  GroupName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    Heading: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(WidgetGroupExpander);
