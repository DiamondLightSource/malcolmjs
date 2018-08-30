Creating a New Design
=====================

A Design forms the heart of your system implementation.  It provides an interactive graphical representation of your system, helping you build and manage:

* `Blocks <block_>` representing hardware components, logic gates, etc.
* The `connectivity <connector_>` between blocks, in terms of input (target) ports and output (source) ports.
* The `attributes <attribute_>` associated with blocks and connectors.
* The `methods <method_>` available to influence behaviour within blocks.


.. _adding_a_block_to_a_design_:

Adding a Block to a Design
-----------------------------

A `block_` is added to a `design_` by dragging and dropping it from the 'Block Palette' into the 'Layout Panel' as follows:

    #. Select the 'plus' icon at the bottom of the Layout Panel.  The Block Palette opens containing the set of blocks currently available to you.
    #. Identify the Block you wish to add.  By hovering over it the mouse pointer changes from an arrow to a hand.
    #. Click the left mouse button to select the Block and while holding down the mouse button drag the Block into the Layout Panel.
    #. When you reach your desired location for the Block within the Layout Panel release the mouse button.

After a brief pause the Block Palette icon is replaced by a full representation of the selected Block, showing:

    * The formal Block identifier.
    * An optional, configurable descriptive label (initially containing default text).
    * `Source ports <source_port_>` available to the Block, including their type.
    * `Sink ports <sink_port_>` available to the Block, including their type.

After adding a Block to the Layout Panel it can be selected by hovering over it and clicking the left mouse button.  Upon selection the Block Information panel presenting each `attribute_` and `method_` available to that Block is displayed in the right-hand panel of the web interface.


.. _removing_a_block_from_a_design_:

Removing a Block from a Design
---------------------------------

If a `block_` has been added to a `design_` erroneously, or is no longer required within the current Design it can be removed as follows:

    #. Select the Block to be removed by hovering over it and clicking the left mouse button.  Upon selection a 'garbage can' icon is displayed at the bottom of the Layout Panel.
    #. While holding down the left mouse button drag the Block over the garbage can icon.  The icon is highlighted.
    #. Release the left mouse button.


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

`block_` attributes come in two forms:

    #. An `immutable_attribute_` is one that once set within the `Design` cannot be modified by any action within the system.  It holds a constant value until manually modified as part of a controlled Design change.
    #. A `writeable_attribute_` is one whose value can be dynamically modified via a 'put' request executed in response to an action within a pre-cursor Block's execution.

Attributes whose value can be specified at design-time are denoted by a highlight below the attribute value field.

Manually Setting or Modifying a Block Attributes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Block attributes are specified via the 'Block Information Panel' associated with the Block you wish to configure.

To configure an attribute:

    #. Select the Block you wish to configure by clicking on it within the Layout Panel.  The selected Block will be highlighted and the Block Information Panel associated with it displayed on the right-hand side of the user interface.
    #. Find the Attribute you wish to configure in the list of available Attributes.
    #. Edit the Attribute value field as necessary:

        * If the Attribute represents a list of pre-defined options select your desired value from the drop-down list.  The Attribute value field updates to reflect the selected value.
        * If the Attribute represents an enable/disable option select the checkbox to enable or disable the Attribute.  If the checkbox is empty the Attribute is disabled .  When enabled a tick is displayed within the checkbox.  
        * If the Attribute requires a manually specified value select the Attribute value field by clicking within it.  Delete any pre-existing content and enter your desired value.  Press the *enter* key for the value to be submitted and recorded.  Values that have been edited but not yet submitted are denoted with a 'pencil' icon.  Upon successful submission the pencil is replaced by the default information symbol.

         **NB:** No data type validation is performed on manually entered values.

During the registration process of a new Attribute value a spinning icon is displayed to the left of the modified Attribute.  For more information on the process this represents see `attribute_change_lifecycle_`.

Upon successful registration the icon associated with the modified Attribute reverts to an information icon.

In case of registration failure a red error icon is displayed next to the modified Attribute.


Automatically Modifying Block Attributes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

I NEED TO EXPLORE THE USE OF PUT REQUESTS HERE


.. _attribute_change_lifecycle_:

The Attribute Change Lifecycle
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Attributes values modified via a Block Information Panel are recorded in the overall `design_`.  Once the Design has been updated the Attribute value takes immediate effect, influencing any executing processes as appropriate from that point forward.

The round-trip from submission of a value via the user interface to utilisation in an execution environment is a non-atomic operation and therefore subject to a stochastic time delay overhead.

Within the user interface the duration of this round-trip is represented by a spinning icon in place of the default information icon upon submission of the Attribute value.  Once the change process is complete the spinning icon reverts to the default information icon.  This reversion is the only reliable indication that a value has been recorded and is now being utilised.


Working with Block Methods
--------------------------

While Block `attributes <attribute_>` define the *behaviour* of a Block, `Methods <method_>` define the *actions* it can perform.

A Method are represented in the user inferface as a button, labelled with the name of the action that will be performed.

NEED MORE DETAIL HERE


Saving a Design
---------------








