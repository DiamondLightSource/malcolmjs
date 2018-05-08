import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import GroupExpander from '../malcolmWidgets/groupExpander/groupExpander.component';
import AttributeDetails from '../malcolmWidgets/attributeDetails/attributeDetails.component';

const styles = theme => ({
  progressContainer: {
    marginTop: 15,
    color: theme.palette.primary.contrastText,
  },
});

const ignoredAttributes = ['icon'];

export const isBlockLoading = block =>
  block && (block.loading || block.attributes.some(a => a.loading));
export const isRootLevelAttribute = a =>
  !a.inGroup &&
  !a.isGroup &&
  !ignoredAttributes.some(ignored => a.name === ignored);
export const areAttributesAvailable = block => block && block.attributes;

const blockLoading = () => (
  <div>
    <CircularProgress color="secondary" />
    <Typography>Loading...</Typography>
  </div>
);

const displayAttributes = block => {
  if (areAttributesAvailable(block)) {
    return (
      <div>
        {block.attributes
          .filter(a => isRootLevelAttribute(a))
          .map(a => <div key={a.name}>{a.name}</div>)}
        {block.attributes.filter(a => a.isGroup).map(group => (
          <GroupExpander key={group.name} groupName={group.name}>
            {block.attributes.filter(a => a.group === group.name).map(a => (
              <AttributeDetails key={a.name} attribute={a}>
                <div>Hello</div>
              </AttributeDetails>
            ))}
          </GroupExpander>
        ))}
      </div>
    );
  }
  return null;
};

const BlockDetails = props => (
  <div className={props.classes.progressContainer}>
    {isBlockLoading(props.block)
      ? blockLoading(props.block)
      : displayAttributes(props.block)}
  </div>
);

BlockDetails.propTypes = {
  block: PropTypes.shape({
    loading: PropTypes.bool,
  }),
  classes: PropTypes.shape({
    progressContainer: PropTypes.string,
  }).isRequired,
};

BlockDetails.defaultProps = {
  block: undefined,
};

export default withStyles(styles, { withTheme: true })(BlockDetails);
