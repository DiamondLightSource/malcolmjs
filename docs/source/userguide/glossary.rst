.. _glossary_:

.. ##########
.. links to external PandA related documentation
.. ##########

.. _PandABlocks-FPGA: https://pandablocks-fpga.readthedocs.io/en/autogen/index.html
.. _malcolm: https://pandablocks-fpga.readthedocs.io/en/autogen/index.html


Glossary
========

.. _attribute_:

Attribute
---------

A property of a `block_`.  

Attributes are divided into four categories based on their purpose:

    * `Parameter <parameter_attribute_>`
    * `Input <input_attribute_>`
    * `Output <output_attribute_>`
    * `Readback <readback_attribute_>`


.. _attribute_group_:

Attribute Group
---------------

A logically grouping of related `attributes <attribute>` within a `block_`.


.. _block_: 

Block
-----

The graphical manifestation of a component within a `design_`, encapsulating its attributes, methods and connectivity to other blocks.

Blocks may represent, for example:

    * Input and output controllers (interfaces to the FPGA).
    * Configurable clocks.
    * Logic lookup tables and logic gates.

A full list of supported blocks, together with their attribute specifications is available from the `PandABlocks-FPGA`_ documentation.


.. _Block_information_panel_:

Block Information Panel
-----------------------

Panel displayed within the user inferface containing details of the `attributes <attribute_>` and `methods <method_>` associated with the currently selected `block_` within the `layout_`.


.. _child_block_:

Child Block
-----------

A `block_` within an assemblage of connected blocks that when aggregated deliver the capability of a larger `Parent Block <parent_block_>`. 

A Child Block may itself represent a Parent Block if its own functionality can be further decomposed. 


.. _connector_:

Connector
---------

The mechanism of transferring content from a `source_port_` in one `block_` to a `sink_port_` in a second Block.  Connections can only be made between ports of the same logical type (e.g. Boolean -> Boolean, int32 -> int32). 


.. _design_:

Design
------

The technical definition of the implemented system describing the `blocks <block_>` it contains, their `attributes <attribute_>` and the `connections <connector_>` between them.

Designs are presented graphically as a `layout_` within the 'Layout Panel' on the web interface allowing a user to build, configure and manage the system represented by that Design.


.. _design_element_:

Design Element
--------------

A generic term for any `block_`, `attribute_` or `connector_` currently forming the focus of interest within the `layout_` view of the PandABox User Interface.  


.. _flowgraph_:

Flowgraph 
---------

The graphical representation of a `design_` showing the `design_element_` within the Control System as presented within the user interface 'Layout View'.



.. _input_attribute_:

Input Attribute
---------------

An Input Attribute identifies the value (or stream of values) that will be received into a `block_` via a `sink_port_` on the Block to which the attribute relates.  There is a 1:1 mapping between Input Attribute and Sink Port.


.. _input_port_:

Input Port
----------

Synonym for `sink_port_`.


.. _layout_:

Layout
------

The graphical representation of a `design_` within the web interface showing the `blocks <block_>` within the Design and the `connections <connector_>` between them based on the selected `root_block_`.


.. _method_:

Method
------

Defines an **action** that can be performed by a `block_` in support of the purpose of that block.


.. _output_attribute_:

Output Attribute
----------------

An Output Attribute identifies the value (or stream of values) that will be transmitted via a `source_port_` out of the `block_` to which the attribute relates.  There is a 1:1 mapping between Output Attribute and Source Port.


.. _output_port_:

Output Port
-----------

Synonym for `source_port_`.


.. _parameter_attribute_:

Parameter Attribute
-------------------

An attribute that supports configuration of its containing `block_` within the context of the `design_` and influencing behaviour of the Block once in an execution environment.


.. _parent_block_:

Parent Block
------------

A `block_` aggregating one-or-more `Child Blocks <child_block_>` each performing an action or activity in support of its parent's functionality.  

Parent blocks, together with their attributes and methods are always presented in the left-hand panel of the web interface when open in Layout View.

.. _readback_attribute_:

Readback Attributes
-------------------

An Attribute whose value is set automatically by a process within the execution environment.  Readback attributes cannot be specified manually via the User Interface.


.. _root_block_:

Root Block
----------

The outermost entity defining the `design_` presented within the user inferface.  If the higest level Root Block is selected this encapulates the entire `design_`, otherwise the Root Block represents a configured `block_` representing an entity within that Design.  The selected Block may itself be a `parent_block_` consisting of multiple `Child Blocks <child_block_>` or a `child_block_` in its own right of the wider Design. 


.. _source_port_:

Source Port
-----------

A port on a `block_` responsible for transmitting data generated within that Block.  

Every Source Port within a Block has a pre-defined type as described in the Block specification.  For details of individual Blocks see `PandABlocks-FPGA`_.  


.. _sink_port_:

Sink Port
----------

A port on a `block_` responsible for accepting data for utilisation within that Block.  

Every Sink Port within a Block has a pre-defined type as described in the Block specification.  For details of individual Blocks see `PandABlocks-FPGA`_.  




