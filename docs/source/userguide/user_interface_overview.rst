User Interface Overview
=======================

The user interface provides three principle views:

    * A **'Design View'**, providing an interactive environment for designing and configuring your hardware system through `block_`, `attribute_` and `connector_` specification.
    * An **'Attribute View'**, providing details of a single Attribute, including the ability to view a graphical representation of the Attribute's value within the system over time.
    * A **'Table View'**, providing a text-based representation of Design and Attribute-based information.

Each view utilises the same basic structure, with content changing dynamically to reflect the purpose of the requested view.  In summary:

    * A 'navigation bar' at the top of the screen provides the ability to move through a Design, selecting elements at increasingly deep levels of implementation.  In doing so it provides a breadcrumb-like map of where you currently are within the Design.
    * A 'left-hand panel' providing *general* information about the element currently forming the central focus of activity.  For example, in `Design View <design_view_>` this will be information about the overall design (name, state, modification status, etc.) whereas in `Attribute View <attribute_view_>` this will be information about the `block_` containing the Attribute of interest.
    * A 'central panel' displaying ...
    * A 'right-hand panel' providing *detailed* information about the element currently forming the central focus of activity.  For example, in `Design View <design_view_>` this will be information about a selected Block within the `layout_` (its attributes and methods) whereas in `Attribute View <attribute_view_>` this will be detailed information about the Attribute itself (name, type, description, status, alarm, etc.).


.. _design_view_:

The Design View
---------------

The Design View is used to create, modify and manage the overall Design of your system.  A typical example of the view you may expect to see is shown below.

.. figure:: screenshots/PANDA-layout-spread-out.png
      :align: center

In this example we see:

    * Summary information about the 'PANDA' system displayed in the 'left-hand' panel.
    * The design of the 'PANDA' system presented in the central `layout_` panel.  Note the 'CLOCKS' `block_` is highlighted.
    * Detailed information about the 'CLOCKS' Block in the 'right-hand' panel, including all of its pre-defined `attributes <attribute_>`.
    * The 'navigation bar' denoting that we are viewing the 'CLOCKS' Block via the layout of the 'PANDA' System.


.. _attribute_view_:

The Attribute View
------------------



.. _table_view_:

The Table View
--------------



