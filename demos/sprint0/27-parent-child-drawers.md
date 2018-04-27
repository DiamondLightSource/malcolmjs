# 27 - Parent/Child Drawer Container

# Demo

1. Start MalcolmJS with ``npm start``
1. Start Storybook with ``npm run storybook``
1. Navigate to ``localhost:9009`` and select the ``Drawer Header/default`` story. Describe how we can develop components in isolation and add documentation for those components.
1. Click on the close button on the ``DrawerHeader`` and show how the action is logged.
1. Switch back to the main MalcolmJS interface on ``localhost:3000`` and show the ``DrawerContainer``.
1. Describe how the ``open``/``closed`` state of the drawers is held in Redux and clicking on the button fires an action round the redux loop. 
1. Click on the close button for the parent view to show the drawer closing.
1. Click on the menu button to show the drawer opening.
1. Show the child drawer closing.
1. Describe how we can fire an action from the layout view to then reopen the child view.