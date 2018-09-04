.. ##########
.. links to external PandA related documentation
.. ##########

.. _PandABlocks-FPGA: https://pandablocks-fpga.readthedocs.io/en/autogen/index.html


Creating a New Design
=====================

A Design forms the heart of your system implementation.  It provides an interactive graphical representation of your system, helping you build and manage:

* `Blocks <block_>` representing hardware components, logic gates, etc.
* The `connectivity <connector_>` between blocks, in terms of input (target) ports and output (source) ports.
* The `attributes <attribute_>` associated with blocks and connectors.
* The `methods <method_>` available to influence behaviour within blocks.

A Design is created in the user interface `Design View <design_view_>`.


.. _adding_a_block_to_a_design_:

Adding a Block to a Design
-----------------------------

A `block_` is added to a `design_` by dragging and dropping it from the 'Block Palette' into the 'Layout Panel' as follows:

    #. Select the 'plus' icon at the bottom of the Layout Panel.  The Block Palette opens containing the set of blocks currently available to you.
    #. Identify the Block you wish to add.  By hovering over it the mouse pointer changes from an arrow to a hand.
    #. Click the left mouse button to select the Block and while holding down the mouse button drag the Block into the Layout Panel.
    #. When you reach your desired location for the Block within the Layout Panel release the mouse button.

After a brief pause the Block Palette icon is replaced by a full representation of the selected Block, showing:

    * The Block name (shown relative to its `parent_block_`).
    * An optional, configurable descriptive label (initially containing default text).
    * `Source Ports <source_port_>` responsible for transmitting output from the Block, including their type.
    * `Sink Ports <sink_port_>` responsible for receiving input to the Block, including their type.

After adding a Block to the Layout Panel it can be selected by hovering over it and clicking the left mouse button.  Upon selection the Block Information panel presenting each `attribute_` and `method_` available to that Block is displayed in the right-hand panel of the web interface.


.. _removing_a_block_from_a_design_:

Removing a Block from a Design
---------------------------------

If a `block_` has been added to a `design_` erroneously, or is no longer required within the current Design it can be removed in one of two ways:

#. *By dragging it to the Garbage Can:*

    #. Select the Block to be removed by hovering over it and clicking the left mouse button.  Upon selection a 'garbage can' icon is displayed at the bottom of the Layout Panel.
    #. While holding down the left mouse button drag the Block over the garbage can icon.  The icon is highlighted.
    #. Release the left mouse button.

#. *Hitting the Delete or Backspace Key:*

    #. Select the Block to be removed by hovering over it and clicking the left mouse button.  The selected Block is highlighted.
    #. Hit the 'Delete' key or backspace key on your keyboard.

Upon removing a Block from your Design all `source_port_` and `sink_port_` connectors associated with it are automatically removed.

Working with the Block Palette
------------------------------

The Block Palette contains a list of each `block_` available to a `design_` based on pre-defined constraints imposed by the underlying hardware infrastructure associated with the system.

When a Block is selected from the Block Palette for `inclusion <adding_a_block_to_a_design_>` in a Design it is removed from the Block Palette to ensure it is not included more than once.  If all Blocks of a particular type have been added to a Design it is not possible to add any more as the underlying hardware implementation will not be able to represent them.

If a Block is `removed <removing_a_block_from_a_design_>` from a Design it is immediately available again for selection in the Block Palette.


Specifying Block Attributes
---------------------------

The behaviour of a `block_` is defined via its `attributes <attribute_>`.  Attributes are pre-defined based on the function of the Block and may include default values providing a starting point for later implementation-time customisation.  A full list of the attributes associated with each Block available from the Block Palette can be found in the `PandABlocks-FPGA`_ documentation.

Types of Attributes
^^^^^^^^^^^^^^^^^^^

Four types of `attribute_` are available, and a `block_` may support zero or more of these depending on its purpose.  These are summarised as follows:

    * `Parameter <parameter_attribute_>` - an Attribute supporting configuration of the Block within the context of the `design_`, ultimately influencing its behaviour once in an execution environment.  
    * `Input <input_attribute_>` - an Attribute identifying the source of data that will be received into a `block_` via a `sink_port_` with the same name. 
    * `Output <output_attribute_>` - anan Attribute identifying the value (or stream of values) that will be transmitted out of a `block_` via a `source_port_` with the same name.
    * `Readback <readback_attribute_>` - an Attribute whose value is set automatically by a process within the execution environment.  Readback attributes cannot be specified manually via the User Interface.

Attributes whose value can be specified at design-time are denoted by a highlight below the attribute value field.

Manually Setting or Modifying a Block Attribute
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Parameter, Input and Output Block attributes are specified via the 'Block Information Panel' associated with the Block you wish to configure.

To configure an attribute:

    #. Select the Block you wish to configure by clicking on it within the Layout Panel.  The selected Block will be highlighted and the Block Information Panel associated with it displayed on the right-hand side of the user interface.
    #. Find the Attribute you wish to configure in the list of available Attributes.
    #. Edit the Attribute value field as necessary:

        * If the Attribute represents a list of pre-defined options select your desired value from the drop-down list.  The Attribute value field updates to reflect the selected value.
        * If the Attribute represents a boolean switch option select the checkbox to enable (switch on) or disable (switch off) the attribute.  If the checkbox is empty the Attribute is *disabled*.  When *enabled* a tick is displayed within the checkbox.  
        * If the Attribute requires manually entered input (e.g. a numerical value or text string) select the Attribute value field by clicking within it.  Delete any pre-existing content and enter your desired value.  Press the *enter* key for the value to be submitted and saved.  Values that have been edited but not yet submitted are denoted with a 'pencil' icon.  Upon successful submission the pencil is replaced by the default information symbol.

         **NB:** No data type validation is performed on manually entered values.

During the process of submitting a new Attribute value to the `design_` a spinning icon is displayed to the left of the modified Attribute.  For more information on the process this represents see `attribute_change_lifecycle_`.

Upon successful submission the icon associated with the modified Attribute reverts to an information icon.

In case of submission failure a red error icon is displayed next to the modified Attribute.


.. _attribute_change_lifecycle_:

The Attribute Change Lifecycle
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Attributes values modified via a Block Information Panel are recorded as part of the overall `design_`.  We refer to the combined submission and recording processes as a *'put'* action (as in 'we are putting the value in the attribute').  

Once the 'put' is complete the Attribute value takes immediate effect, influencing any executing processes as appropriate from that point forward.

The round-trip from submission of a value via the user interface to its utilisation in the execution environment takes a small but non-deterministic period of time while data is transferred, validated and ultimately recorded in the Design.  Attribute modification cannot therefore be considered an atomic process. 

Within the user interface the duration of this round-trip is represented by a spinning icon in place of the default information icon upon submission of the Attribute value.  Once the change process is complete the spinning icon reverts to the default information icon.  This reversion is the only reliable indication that a value has been recorded and is now being utilised.

Note that the value of a manually specified Attribute is not *saved* permanently until the overall `design_` has been `saved <saving_a_design_>`.


Working with Block Methods
--------------------------

While Block `attributes <attribute_>` define the *behaviour* of a Block, `Methods <method_>` define the *actions* it can perform.

A Method in represented in the user inferface as a button, labelled with the name of the action that will be performed.

A full list of the Methods available within each Block can be found in the `PandABlocks-FPGA`_ documentation. 


**MORE HERE** 


Block Ports
-----------

If their purpose demands it Blocks are capable of *receiving* input information via one or more `Sink Ports <sink_port_>` and *transmitting* information via one or more `Source Ports <source_port_>`.

A list of the Source ports and Sink ports associated with each Block can be found in the `PandABlocks-FPGA`_ documentation. 

To aid the design process ports are colour coded to denote the type of information they transmit (`Source Ports <source_port_>`) or receive (`Sink Port <sink_port_>`).  These are summarised below:

.. table::
    :widths: auto
    :align: center

    +-------------+------------+
    | Port Type   | Key        | 
    +=============+============+
    | Boolean     | Blue       |
    +-------------+------------+
    | Int32       | Yellow     |
    +-------------+------------+
    | Motor       | Green      |
    +-------------+------------+
    | NDArray     | Purple     |
    +-------------+------------+

Transmission of information between a Source Port on one Block to a Sink Port on a second Block is achieved via a `connector_`.  For further information about working with Connectors see `connecting_blocks_`. 


.. _connecting_blocks_ :

Connecting Blocks
-----------------

Blocks are linked to one another via `Connectors <connector_>`.  A Connector joins a `source_port_` from one Block to a `sink_port_` on another.  Both ports must be of the same type.  The ports available to a Block and their specification are defined in the `PandABlocks-FPGA`_ documentation.  



Creating a Block Connector
^^^^^^^^^^^^^^^^^^^^^^^^^^

To create a connection between two blocks:

    #. Select the `source_port_` or `sink_port_` representing one terminus of the link you wish to make by hovering over the Port on the Block.  The Port will be temporarily highlighted.
    #. Click the left mouse button and while holding it down drag the Connector to the Port representing the other terminus of the link you wish to make.  The target port will be temporarily highlighted.
    #. Release the mouse button.  If the `Connector constraints <constraints_when_using_connectors_>` defined below have been respected the Connector is displayed within the Design Layout.

        * If an error occurs during the creation process details are displayed at the bottom of the Layout panel.

For convenience during the Design process it is also possible to create a Connector with only one terminus until such time that its other terminus has been specified.  To create a single terminus Connector:

    #. Select the `source_port_` or `sink_port_` representing one terminus of the link you wish to make by hovering over the Port on the Block.  The Port will be temporarily highlighted.
    #. Click the left mouse button and while holding it down drag the Connector away from the Block.
    #. Release the mouse button.  The new Connector is displayed within the Design Layout.  Note that the un-linked terminus of the Connector is represented by a grey circle.
      
To confirm the Connection has been created as expected hover over the Connector.  The Connector changes from a solid line to a dashed line, animated to denote the direction of information flow between its `source_port_` and `sink_port_`.

Interrogating Connector Attributes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

As with a `block_` a `connector_` also possesses `attributes <attribute_>`.  Unlike Block attributes however Connector attributes cannot be pre-defined, so there is no default specification to guide your configuration.

To interrogate the attributes associated with the Connector you have created:

    #. Hover over the Connector of interest.  The Connector changes to a dashed line showing the direction of information flow.
    #. Click the left mouse button to select the Connector.  A Connector Information Panel open in the 'right-hand panel' of the user interface.

The Connector Information Panel contains details of the `source_port_` and `sink_port_` of the Connector.  

Note that it is possible to modify the Source and Sink associated with the Connector from the Connector Information Panel.  Do so cautiously as this will impact your overall system Design, and may invalidate pre-existing design decisions.


Removing a Connector
^^^^^^^^^^^^^^^^^^^^

If a `connector_` has been added to a `design_` erroneously, or is no longer required within the current Design it can be removed in one of two ways:

#. *Hitting the 'Delete' or backspace key:*

    #. Hover over the Connector of interest.  The Connector changes to a dashed line showing the direction of information flow.
    #. Click the left mouse button to select the Connector. The Connector is highlighted.
    #. Hit the 'Delete' or backspace key on your keyboard.  The Connector is removed from the Design Layout.


#. *Via the Connector Information Panel:*

    #. Hover over the Connector of interest.  The Connector changes to a dashed line showing the direction of information flow.
    #. Click the left mouse button to select the Connector.  A Connector Information Panel open in the 'right-hand panel' of the user interface.
    #. Select the 'Delete' button in the Connector Information Panel.  The Connector is removed from the Design Layout.


.. _constraints_when_using_connectors_:

Constraints When Using Connectors
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Connectors are subject to the following constraints:

    * A `sink_port_` can only accept a single Connector.
    * Multiple Connectors can originate from a `source_port_`, connecting multiple Blocks to that Source Port.
    * Connectors can only be used to link a `source_port_` and a `sink_port_` of the same logical type (e.g. boolean, int32).  Port types are specified in the `PandABlocks-FPGA`_ documentation, and colour coded within the Design Layout to aid identification of similarly typed ports.


.. _saving_a_design_:

Saving a Design
---------------

You can save your Design at any time during the creation or modification process, and we recommend you do so regularly.

To save a Design:

    #. Navigate to the `root_block_` representing the highest level of the Design you wish to save.
    #. Navigate to the 'Save' Attribute Group at the bottom of the left-hand panel.  Expand it if necessary.
    #. Enter a descriptive name for the Design in the 'Design' field.  Note this will be used later to identify existing Designs available for use.

        * You must enter a name even if saving a modified existing Design.  To mimic traditional save functionality enter the same name as saved previously.
    #. Select the 'Save' button.  The information icon to the left of the button will spin to denote the save is in progess, returning to the information icon when the Design is saved.

        * If an error is detected during the save process a red warning icon is displayed next to the button.


Opening an Existing Design
--------------------------

When a `root_block_` is opened a list of all `Designs <design_>` within it is available via the 'Design' Attribute displayed in the left-hand panel.  Selecting a pre-existing Design results in the Design being presented in the central Layout panel.

To open an existing Design:

    #. Navigate to the `root_block_` represening the hghest level of the system you wish to use.
    #. Navigate to the 'Design' Attribute and select the dropdown arrow to display the list of available Designs.
    #. Select the Design you wish to use.
    #. Select the 'View' option associated with the 'Layout' Attribute.

        **NB:** If no previously saved designs exist the 'Design' Attribute list will be empty.


Working Collaboratively on a Design
-----------------------------------

Disabling a Design
------------------




