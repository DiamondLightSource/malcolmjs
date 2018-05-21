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
  root: {
    backgroundColor: theme.palette.primary.main,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 24,
  },
  expanded: {
    backgroundColor: theme.palette.primary.main,
    margin: '0px 0 !important',
    minHeight: '36px !important',
  },
  content: {
    backgroundColor: theme.palette.primary.main,
    margin: '0px 0 !important',
    minHeight: '24px !important',
    display: 'flex',
  },
  expandIcon: {
    width: '24px',
    height: '24px',
  },
  heading: {
    alignSelf: 'center',
  },
  detailsRoot: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

const WidgetGroupExpander = props => (
  <div>
    <ExpansionPanel defaultExpanded={props.expanded}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          root: props.classes.root,
          content: props.classes.content,
          expanded: props.classes.expanded,
          expandIcon: props.classes.expandIcon,
        }}
      >
        <Typography className={props.classes.heading}>
          {props.groupName}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        classes={{
          root: props.classes.detailsRoot,
        }}
      >
        <div style={{ width: '100%' }}>{props.children}</div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

WidgetGroupExpander.propTypes = {
  expanded: PropTypes.bool,
  groupName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string,
    expanded: PropTypes.string,
    content: PropTypes.string,
    expandIcon: PropTypes.string,
    heading: PropTypes.string,
    detailsRoot: PropTypes.string,
  }).isRequired,
};

WidgetGroupExpander.defaultProps = {
  expanded: false,
};

export const GroupExpanderComponent = WidgetGroupExpander;
export default withStyles(styles, { withTheme: true })(WidgetGroupExpander);
