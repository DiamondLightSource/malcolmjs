export const openParentPanelType = 'OPEN_PARENT_PANEL';
export const openChildPanelType = 'OPEN_CHILD_PANEL';

export const openParentPanel = open => ({
  type: openParentPanelType,
  openParentPanel: open,
});

export const openChildPanel = open => ({
  type: openChildPanelType,
  openChildPanel: open,
});

export default { openParentPanel, openChildPanel };
