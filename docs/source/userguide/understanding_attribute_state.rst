Understanding Attribute State
=============================

At any given time an Attribute can be in one of several states.  State is
dependent upon a range of factors including:

  * The value associated with the Attribute.
  * The pre-defined permissible operating range/threshold appropriate to the
    specification of the Attribute.
  * The workflow that the Attribute is currently involved in.
  * The context of the overall control system.

State information is presented in the user interface as a symbol displayed to
the left of the Attribute name, with the following states represented:


Normal State
------------

Data associated with the Attribute is within an acceptable operating theshold or
range.  For a `Parameter Attribute` this also means the value has been
successfully `put <Attribute Change Lifecycle>` onto the underlying server.

.. figure:: images/information_icon.png
    :align: center


Processing State
----------------

Data has been submitted to the underlying server or a request has been made to
retrieve information from the underlying server.  In both cases a process has
been triggered and a response is a awaited.

*GET IMAGE*

Locally Edited State
--------------------

Data within the user interface has been changed but not yet `put
<Attribute Change Lifecycle>` to the underlying server.  Consequently the local
edit will have no effect on execution of the system and will not be saved as
part of the `Design`.

.. figure:: images/locally_edited_icon.png
    :align: center

Update Error State
------------------

The Attribute value `put <Attribute Change Lifecycle>` to the underlying server
has not been accepted.  This typically occurs because the value has failed the
validation test associated with the Attibute as defined in its Block
specification.

*GET IMAGE*


Warning State
--------------

An issue has been detected and requires investigation.  This state is typically
triggered when an `Input Attribute`, `Output Attribute` or
`Readback Attribute` data is deemed to be outside normal operating parameters
but is still considered acceptable.

.. figure:: images/warning_icon.png
    :align: center


Error State
-----------

An issue has been detected resulting in an error being reported by the
underlying server.  This state is typically triggered when `Input Attribute`,
`Output Attribute` or `Readback Attribute` data is deemed to be outside
acceptable operating conditions and immediate action is recommended.

.. figure:: images/error_icon.png
  :align: center


Invalid State
-------------

The overall Block context has changed since the user interface was last
accessed.  Data displayed may no longer be accurate or consistent with the
current `design`

.. figure:: images/disconnected_icon.png
    :align: center


Disconnected State
------------------

Communication with the Block hosting the Attribute has been lost by the
underlying server.  Immediate investigation is recommended.

*GET IMAGE*


.. NOTE::

    Operating ranges and threshold values are not specified directly within the
    user interface but instead via configuration of individual Attributes in the
    underlying Block Specification.  These settings are then reflected into the
    User Interface.  See specific Block documentation for additional
    information.


Presenting Status Information
-----------------------------

Within Block Information Panels (presented in either the left-hand or right-hand
panels) status information is displayed to the left of each Attribute via the
corresponding state icon (see table above).

When presenting historical Attribute value data via the `Attribute value table
<Monitoring Attribute Values>` view corresponding icons are displayed against
each row of data.

When presenting historical Attribute value data via the `Attribute Chart
<Monitoring Attribute Values>` view the line colour denotes the alarm state.

