Glossary
========

.. ##########
.. links to external PandA related documentation
.. ##########

.. _PandABlocks-FPGA: https://pandablocks-fpga.readthedocs.io
.. _malcolm: https://pymalcolm.readthedocs.io

These are some commonly used terms in this documentation.

.. glossary::

  Attribute

    A property of a `block`.

    Attributes are divided into four categories based on their purpose:

        * `Parameter Attribute`
        * `Input Attribute`
        * `Output Attribute`
        * `Readback Attribute`

  Attribute Group

    A logically grouping of related `attributes <attribute>` within a `block`.

    Within the user interface these are represented as a collapsable block
    within the overall `Block Information Panel`.


  Block

    The graphical manifestation of a component within a `design`, encapsulating
    its attributes, methods and connectivity to other blocks.

    Blocks may represent, for example:

        * Input and output controllers (interfaces to the FPGA).
        * Configurable clocks.
        * Logic lookup tables and logic gates.

    A Block is defined my its underlying Block specification, which is
    interrogated by `malcolm`_ and reflected into the user interface. For
    example, the list of supported blocks available for a PandA device is
    described in `PandABlocks-FPGA`_ documentation.


  Block Information Panel

    Panel displayed within the user inferface containing details of the
    `attributes <attribute>` and `methods <method>` associated with the
    currently selected `block` within the `layout`.


  Child Block

    A `block` within the `layout` of a `Parent Block`.

    A Child Block may itself represent a Parent Block if its own functionality
    can be further decomposed.


  Design

    The technical definition of the overall system, or a component within it,
    describing the `blocks <block>` it contains, their `attributes <attribute>`
    and the `links <link>` between them.  A Design is represented as a
    `Parent Block` within the user interface.

    Designs are presented graphically as a `layout` within the 'Layout Panel'
    on the web interface allowing a user to build, configure and manage the
    system represented by that Design.


  Design Element

    A generic term for any `block`, `attribute` or `link` currently forming the
    focus of interest within the `layout` view of the PandABox User Interface.


  Flowgraph

    The graphical representation of a `design` showing the `Design Element`
    within the Control System as presented within the user interface 'Layout
    View'.


  Input Attribute

    An Input Attribute identifies the value (or stream of values) that will be
    received into a `block` via a `Sink Port` on the Block to which the
    attribute relates.  There is a 1:1 mapping between Input Attribute and Sink
    Port.


  Input Port

    Synonym for `Sink Port`.


  Layout

    The graphical representation of a `design` within the web interface showing
    the `blocks <block>` within the Design and the `links <link>` between them
    based on the selected `Root Block`.


  Link

    The mechanism of transferring content from a `Source Port` in one `block`
    to a `Sink Port` in a second Block.  Links can only be made between ports
    of the same logical type (e.g. Boolean -> Boolean, int32 -> int32).


  Method

    Defines an **action** that can be performed by a `block` in support of the
    purpose of that block.


  Output Attribute

    An Output Attribute identifies the value (or stream of values) that will be
    transmitted via a `Source Port` out of the `block` to which the attribute
    relates.  There is a 1:1 mapping between Output Attribute and Source Port.


  Output Port

    Synonym for `Source Port`.


  Parameter Attribute

    An attribute whose value can be set by a User within a `block` in order to
    influence the behaviour of that `block`.


  Parent Block

    A `block` aggregating one-or-more `Child Blocks <Child Block>` each
    performing an action or activity in support of its parent's functionality.

    Parent blocks, together with their attributes and methods are typically
    presented in the left-hand panel of the web interface when open in Layout
    View.

  Readback Attribute

    An Attribute whose value is set automatically by a process within the
    execution environment.  Readback attributes cannot be set manually via the
    User Interface.


  Root Block

    The outermost entity defining the content presented within the user
    interface.  If the outermost Block representing a `design` is selected this
    encapulates the entire `design`, from where a user can 'drill down' to an
    area of interest.  Otherwise the Root Block represents any configured
    `block` within the `design`.


  Source Port

    A port on a `block` responsible for transmitting data generated within that
    Block.

    Every Source Port within a Block has a pre-defined type as described in the
    Block specification.


  Sink Port

    A port on a `block` responsible for accepting data for utilisation within
    that Block.

    Every Sink Port within a Block has a pre-defined type as described in the
    Block specification.

