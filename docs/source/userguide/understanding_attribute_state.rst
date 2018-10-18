.. _understanding_attribute_state_:

Understanding Attribute State
=============================

At any given time an Attribute can be in one of four states, with the state dependent upon:

  * The value associated with the Attribute.
  * The pre-defined permissible operating range/threshold appropriate to the specification of the Attribute.

In turn, state information is used to alert you when an Attribute value is found to be outside its acceptable pre-specified parameters.  This is presented in the User Interface as a symbol displayed to the left of the Attribute name.  

The four states, and their associated representation in the User Interface are:

.. list-table::
    :widths: 20 70 10
    :align: center
    :header-rows: 1

    * - State  
      - Description
      - icon
    * - Normal
      - Data associated with the Attribute is within acceptable parameters.
      - .. figure:: images/information_icon.png
            :align: center
    * - Warning
      - Data is deemed to be outside normal operating parameters but is still considered acceptable.
      - .. figure:: images/warning_icon.png
            :align: center
    * - Error
      - Attribute data is deemed to be outside acceptable operating conditions and immediate action is recommended.  
      - .. figure:: images/error_icon.png
            :align: center            
    * - Disconnected
      - The Block hosting the Attribute is not currently connected and data is therefore not available.
      - .. figure:: images/disconnected_icon.png
            :align: center    


Operating ranges and threshold values are not specified directly within the user interface but instead via configuration of individual Attributes in the underlying Block Specification.  These settings are then reflected into the User Interface.  See specific Block documentation for additional information.


Status Alert Coverage
---------------------

Alerts can be used to monitor any of the following `attribute_` types:

.. list-table::
    :widths: auto
    :align: center
    :header-rows: 1

    * - Attribute Type
      - Alerts When...
    * - `Input <input_attribute_>`
      - Input to a Block via a `sink_port_` varies from expectation.
    * - `Output <output_attribute_>`
      - Output from a Block via a `source_port_` varies from expectation.
    * - `Readback <readback_attribute_>`
      - Intrinsic Attribute within a Block varies from expectation.


Presenting Status Information
-----------------------------

Within Block Information Panels (presented in either the left-hand or right-hand panels) status information is displayed to the left of each Attribute via the corresponding state icon (see table above).

When presenting historical Attribute value data via the `Attribute value table <monitoring_attribute_values_>` view corresponding icons are displayed against each row of data.

When presenting historical Attribute value data via the `Attribute Chart <monitoring_attribute_values_>` view the line colour denotes the alarm state.

