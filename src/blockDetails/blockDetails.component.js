import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import GroupExpander from '../malcolmWidgets/groupExpander/groupExpander.component';
import AttributeDetails from '../malcolmWidgets/attributeDetails/attributeDetails.component';
import MethodDetails from '../malcolmWidgets/method/method.component';
import blockUtils from '../malcolm/blockUtils';

const ascii404 =
  '                __     __      _____      __     __ \n' +
  '               |\\  \\  |\\  \\   |\\   __  \\  |\\  \\  |\\  \\ \n' +
  '               \\ \\  \\\\_\\  \\ \\ \\  \\|\\  \\ \\ \\ \\\\_\\  \\ \n' +
  '                 \\ \\___     \\ \\ \\  \\_\\  \\ \\ \\ ___   \\ \n' +
  '                   \\|___|\\__\\ \\ \\_____\\ \\|___|\\__\\ \n' +
  '                           \\|__|   \\|______|         \\|__| \n';

const styles = theme => ({
  progressContainer: {
    marginTop: 15,
    color: theme.palette.primary.contrastText,
  },
  endDivider: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
});

const ignoredAttributes = ['widget:icon'];

export const isBlockLoading = (
  block,
  blockName,
  blockList,
  navList,
  shouldExist
) => {
  if (blockList.length > 0) {
    if (!shouldExist) {
      return false;
    }
    if (
      (block !== undefined && block.loading === 404) ||
      (navList.length > 0 &&
        block === undefined &&
        !blockList.includes(blockName))
    ) {
      return 404;
    }
    return (
      block !== undefined &&
      (block.loading || block.attributes.some(a => a.calculated.loading))
    );
  }
  return true;
};
export const isRootLevelAttribute = a =>
  !a.calculated.inGroup &&
  !a.calculated.isGroup &&
  !a.calculated.isMethod &&
  !ignoredAttributes.some(
    ignored =>
      a.raw &&
      a.raw.meta &&
      a.raw.meta.tags &&
      a.raw.meta.tags.findIndex(t => t === ignored) > -1
  );
export const areAttributesAvailable = block => block && block.attributes;

const blockLoadingSpinner = notFound =>
  notFound ? (
    <div>
      <div align="left" style={{ fontFamily: 'Roboto', whiteSpace: 'pre' }}>
        {ascii404}
      </div>
      <br />
      <br />
      <Typography color="inherit">Block not found....yet</Typography>
      <Typography color="inherit">
        it may still be loading and appear later
      </Typography>
      <Typography color="inherit">(hint: URLs are case sensitive)</Typography>
    </div>
  ) : (
    <div>
      <CircularProgress color="secondary" />
      <Typography>Loading...</Typography>
    </div>
  );

export const areAttributesTheSame = (oldAttributes, newAttributes) =>
  oldAttributes.length === newAttributes.length &&
  oldAttributes.every(
    (old, i) => old.calculated.name === newAttributes[i].calculated.name
  ) &&
  oldAttributes.every(
    (old, i) => old.calculated.inGroup === newAttributes[i].calculated.inGroup
  ) &&
  oldAttributes.every(
    (old, i) => old.calculated.isGroup === newAttributes[i].calculated.isGroup
  ) &&
  oldAttributes.every(
    (old, i) => old.calculated.isMethod === newAttributes[i].calculated.isMethod
  ) &&
  oldAttributes.every(
    (old, i) =>
      isRootLevelAttribute(old) === isRootLevelAttribute(newAttributes[i])
  );

const GroupDivider = props => <div className={props.classes.endDivider} />;

const methodHasParameters = method =>
  Object.keys(method.takes.elements).length > 0 ||
  Object.keys(method.returns.elements).length > 0;

const showDivider = (methods, index) =>
  methodHasParameters(methods[index].raw) &&
  ((index < methods.length - 1 &&
    methodHasParameters(methods[index + 1].raw)) ||
    index === methods.length - 1);

const displayAttributes = props => {
  if (props.attributesAvailable) {
    return (
      <div>
        {props.rootAttributes.map(a => (
          <AttributeDetails
            key={a.calculated.name}
            attributeName={a.calculated.name}
            blockName={props.blockName}
          />
        ))}
        {props.groups.map(group => (
          <GroupExpander
            key={group.attribute.calculated.name}
            groupName={group.attribute.raw.meta.label}
            expanded={group.attribute.raw.value === 'expanded'}
          >
            {group.children.map(a => (
              <AttributeDetails
                key={a.calculated.name}
                attributeName={a.calculated.name}
                blockName={props.blockName}
              />
            ))}
          </GroupExpander>
        ))}
        {props.methods.map((method, i) => (
          <div>
            <MethodDetails
              key={method.calculated.name}
              blockName={props.blockName}
              attributeName={method.calculated.name}
            />
            {showDivider(props.methods, i) ? (
              <GroupDivider classes={props.classes} />
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BlockDetails = props => (
  <div className={props.classes.progressContainer}>
    {props.blockLoading
      ? blockLoadingSpinner(props.blockLoading === 404)
      : displayAttributes(props)}
  </div>
);

BlockDetails.propTypes = {
  blockLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
    .isRequired,
  classes: PropTypes.shape({
    progressContainer: PropTypes.string,
  }).isRequired,
};

BlockDetails.defaultProps = {
  block: undefined,
};

displayAttributes.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributesAvailable: PropTypes.bool.isRequired,
  rootAttributes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  methods: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

GroupDivider.propTypes = {
  classes: PropTypes.shape({
    endDivider: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, ownProps, memory) => {
  const stateMemory = memory;
  stateMemory.orphans = stateMemory.orphans || [];
  let block;
  const blockList = state.malcolm.blocks['.blocks']
    ? state.malcolm.blocks['.blocks'].children
    : [];
  if (ownProps.parent) {
    block = state.malcolm.parentBlock
      ? state.malcolm.blocks[state.malcolm.parentBlock]
      : undefined;
  } else {
    block = state.malcolm.childBlock
      ? state.malcolm.blocks[state.malcolm.childBlock]
      : undefined;
  }
  const panelIsOpen = ownProps.parent
    ? state.viewState.openParentPanel
    : state.malcolm.childBlock !== undefined;
  const blockLoading = isBlockLoading(
    block,
    ownProps.parent ? state.malcolm.parentBlock : state.malcolm.childBlock,
    blockList,
    state.malcolm.navigation.navigationLists,
    panelIsOpen
  );
  if (
    block &&
    block.attributes &&
    (!areAttributesTheSame(stateMemory.oldAttributes, block.attributes) ||
      block.orphans.some(a => !stateMemory.orphans.includes(a)))
  ) {
    stateMemory.rootAttributes = [
      ...block.attributes.filter(a =>
        blockUtils.attributeHasTag(a, 'widget:help')
      ),
      ...block.attributes.filter(
        a =>
          isRootLevelAttribute(a) &&
          !(
            block.orphans &&
            block.orphans.some(orphan => orphan === a.calculated.name)
          ) &&
          !blockUtils.attributeHasTag(a, 'widget:help')
      ),
    ];
    stateMemory.orphans = block.orphans;
    stateMemory.groups = block.attributes
      .filter(a => a.calculated.isGroup)
      .map(group => ({
        attribute: group,
        children: block.attributes.filter(
          a =>
            a.calculated.group === group.calculated.name &&
            !(
              block.orphans &&
              block.orphans.some(orphan => orphan === a.calculated.name)
            )
        ),
      }));

    stateMemory.methods = block.attributes.filter(a => a.calculated.isMethod);

    stateMemory.oldAttributes = block.attributes;
  }
  return {
    blockName: block ? block.name : '',
    blockLoading,
    attributesAvailable: areAttributesAvailable(block) !== undefined,
    rootAttributes: stateMemory.rootAttributes,
    groups: stateMemory.groups,
    methods: stateMemory.methods,
  };
};

const memoizedMapStateToProps = () => {
  const blockDetailsMemory = {
    oldAttributes: [],
    rootAttributes: [],
    groups: [],
    methods: [],
  };

  return (state, ownProps) =>
    mapStateToProps(state, ownProps, blockDetailsMemory);
};
export default connect(memoizedMapStateToProps)(
  withStyles(styles, { withTheme: true })(BlockDetails)
);
