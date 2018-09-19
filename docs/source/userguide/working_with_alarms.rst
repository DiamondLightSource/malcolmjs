.. _working_with_alarms_:

Working With Alarms
===================

Alarms are used within PandA to alert you when Attributes within the Blocks representing components of your system are operating outside acceptable pre-specified parameters.  This may represent Atttributes reporting larger or smaller values than anticipated, a prolonged period of inactivity, or a broken connection within the system.

Alarms and their parameter threshold values are not specified directly within PandA but instead via configuration of individual Attributes in the underlying `PandABlocks-FPGA <PandABlocks-FPGA>`_ component library.  These settings are then reflected into PandA's User Interface.


Alarm States
------------

The PandA User Inferface reflects the three tiered alarm classification utilised within the underlying `PandABlocks-FPGA <PandABlocks-FPGA>`_ component library:

.. table::
    :widths: auto
    :align: center

    +------------------+---------------------------------------------------------------------+
    | Alarm Category   | Description                                                         | 
    +==================+=====================================================================+
    | Normal           | Data associated with the Attribute is within acceptable parameters. |
    +------------------+---------------------------------------------------------------------+
    | Warning          | Data is deemed to be outside normal operating parameters but is     |
    |                  | still considered acceptable.                                        |
    +------------------+---------------------------------------------------------------------+
    | Major            | Attribute data is deemed to be outside acceptable operating         |
    |                  | conditions and immediate action is recommended.                     |
    +------------------+---------------------------------------------------------------------+
    | Disconnected     | The Block hosting the Attribute is not currently connected and      |
    |                  | data is therefore not available.                                    |
    +------------------+---------------------------------------------------------------------+

**DEFINITIONS TO BE CONFIRMED**


Alarm Coverage
--------------

Alarms can be used to monitor any of the following  `attribute_` types:

    * `Input <input_attribute_>` - alerts when the input to a Block via a `sink_port_` varies from expectation.
    * `Output <output_attribute_>` - alerts when the output from a Block via a `source_port_` varies from expectation.
    * `Readback <readback_attribute_>` - alerts when an intrinsic Attribute within a Block varies from expectation.


Alarm Notifications
-------------------

Alarms are presented via the PandA User Inferface using a combination of colour and symbols to identify the nature of the alarm as follows:

.. table::
    :widths: auto
    :align: center

    +------------------+---------------+-----------------+
    | Alarm Category   | Colour Code   |  Symbol         |                  
    +==================+=================================+
    | Normal           | Blue          | Open circle     |          
    +------------------+---------------------------------+
    | Warning          | Yellow        | Triangle        | 
    +------------------+---------------------------------+
    | Major            | Red           | Filled circle   |
    +------------------+---------------------------------+
    | Disconnected     | Purple        | N/A             |
    +------------------+---------------------------------+

**?potential to use image here?**

Within Block Information Panels (presented in either the left-hand or right-hand panels) alarm states are displayed to the left of each Attribute, the default 'blue information icon' representing a 'normal' alarm state.  

When presenting Attribute data via the `Attribute Table <working_with_tables_>` view corresponding icons are displayed against each row of data.

When presenting Attribute data via the `Attribute Chart <working_with_charts_>` view the line colour denotes the alarm state.

