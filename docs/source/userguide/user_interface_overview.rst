.. _user_interface_overview_:

User Interface Overview
=======================

The User Interface provides a fully interactive environment for designing, configuring and managing components and their connections that together define the underlying Control System.


.. _principle_ui_views_:

Principle User Interface views
------------------------------

To support design, configuration and management activies the User Interface provides three principle views into the underlying Control System:

.. list-table::
    :widths: 20, 80
    :align: center
    :header-rows: 1

    * - View
      - Content
    * - Layout View
      - Provides an interactive environment for designing and configuring your Control System through `block_`, `attribute_` and `connector_` specification.  The resulting `flowgraph_` provides a visual representation of the formal Control System `design_`.
    * - Attribute View
      - Provides details of a single Attribute, including the ability to view graphical representation of the Attribute's value within the control System over time.

User Interface Components
-------------------------

Each of the views introduced in `principle_ui_views_` utilises the same basic structure, with content changing dynamically to reflect the purpose of the requested view.  In summary:

    * A *'navigation bar'* at the top of the screen provides the ability to move through the currently open Design, selecting design elements at increasingly deep levels of implementation.  In doing so it provides a breadcrumb-like map of where you currently are within the Design.
    * A *'left-hand panel'* providing **general** information about the `design_element_` currently forming the central focus of interest within the User Interface.  For example, in `Layout View <layout_view_>` the left-hand panel will contain information about the overall Control System Design (name, state, modification status, etc.) whereas in `Attribute View <attribute_view_>` the panel will display information about the containing `block_` of that Attribute.
    * A *'central panel'* displaying information about an Attribute selected from the Block presented in the 'left-hand panel'.  In `Layout View <layout_view_>` an interactive graphical representation of the formal Control System Design is shown, in `Attribute View <attribute_view_>` a plot of Attribute data against time is displayed.  In `Table View <table_view_>` an appropriately formatted text-based representation of Attribute data is presented.
    * A *'right-hand panel'* providing **detailed** information about the `design_element_` currently in focus within the 'left-hand panel'.  For example, if the 'left-hand panel' represents the `root_block_` then the 'right-hand panel' reflects a `block_` within the Control System Design, whereas if the 'left-hand panel' represents a `block_` the 'right-hand panel' reflects an `attribute_` within that Block.     


.. _layout_view_:

The Layout View
---------------

Layout View is used to create, modify and manage the overall Design of your Control System.  

Layout View is accessed via the **'View'** button associated with the *'Layout'* Attribute or a `root_block_` or `parent_block_`.   

Once the `layout_` is displayed individual `blocks <block_>` within it can moved around the screen by clicking and dragging them to your desired location.  Any `connectors <connector_>` will be dynamically re-routed to accommodate the new location.  Note there is also the ability to automatically optimise the Layout via the **'Auto Layout'** button within the 'central panel'.

A typical example of the view you may expect to see is shown below.

.. figure:: screenshots/PANDA-layout-spread-out.png
      :align: center

In this example we see:

    * Summary information about the 'PANDA' system displayed in the 'left-hand panel'.
    * The Design of the PandABox Control System presented in the central `layout_` panel.  Note the 'CLOCKS' `block_` is highlighted.
    * Detailed information about the 'CLOCKS' Block in the 'right-hand' panel, including all of its pre-defined `attributes <attribute_>`.
    * The 'navigation bar' denoting that we are viewing the 'CLOCKS' Block via the layout of the 'PANDA' System.


.. _attribute_view_:

The Attribute View
------------------

The User Interface automatically transitions to Attribute View when an Attribute is selected from either the 'left-hand panel' or 'right-hand panel'.  

    * If the Attribute is selected from the 'left-hand panel' more detailed information about that Attribute is displayed in the 'right-hand panel'.
    * If the Attribute is selected from the 'right-hand panel' the `design_element_` represented in the 'right-hand panel' is transferred to the 'left-hand panel' as the new focus of interest, with more detailed information about the selected Attribute now presented on the right.

In both cases the 'central panel' presents a view of the Attribute's value against time.  This may represent a constantly changing value, for example a calculated data value updated every 2ms, or a periodically changing boolean on/off status indicator that only changes every 10h.  Two representations of the Attribute value are available and can be selected by choosing the appropriate option at the bottom of the 'central panel' thus:

    * Plot - presents the Attribute Value as a line chart, displaying value against time on the pre-defined timing interval (potentially specified via a second Attribute within the same `block_`.  This graphical view is interactive and as a user you have the ability to undertake basic activities within the chart including panning, zooming and exporting for offline use.  See `working_with_charts_` for further information.
    * Table - presents the Attribute Value as a series of rows in a table.  Each row represents the value at a different time point.  See `working_with_tables_` for further information.
    
**THIS NEEDS AN IMAGE**

Panel Popping
-------------

Under normal use the 'left-hand panel' contains summary information about the current `block_` in focus and the 'right-hand panel' detailed information relating to an `attribute_` or `method_` associated with that Block.  In complex systems it may be desireable to display information about a number of connected Blocks to track how each updates as data moves through the system they represent.  This can be achieved by *'popping'* the Block Information Panel via the icon in the top left-hand corner of the information panel.  This causes the Block Information Panel to open in its own independent window.  Multiple panels can be opened in the same way.  

Connectivity to the underlying system is maintained meaning each independent window is updated in response to activity within the Control System.  Similarly, manual updates to any Attribute within an independent Information Panel is reflected back to the Control System in the same way as occurs when the Information Panel is integrated with the main user interface.

**THIS NEEDS AN IMAGE OF MULTIPLE WINDOWS**


