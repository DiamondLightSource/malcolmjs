Introduction
============

Overview
---------

MalcolmJS provides a web-based graphical interface to the underlying
functionality provided by the `Malcolm middleware
<https://pymalcolm.readthedocs.io/en/latest/>`_ library, which itself provides a
common interface to a range of control system and data management technologies.

The web-based environment does not provide direct access to hardware components.
Instead, information about the hardware components themselves, and the data they
generate, is shared with our user environment via Malcolm.  This allows you to
generate a *virtual representation* of your control system before providing
design and configuration information about it to Malcolm via a dedicated
service.  Malcolm takes this information and uses it to interface with the
underlying physical hardware.  We can consider this schematically as:

.. figure:: ./userguide/images/system_context.svg
      :align: center


The Malcolm Service provides three key capabilities:

    * Details of the building blocks available to our user environment, allowing
      a System Implementor to set up their control system components
      realistically.  During this process design decisions can be validated
      against pre-defined parameters to ensure validity of the design.

    * Once deployed into an operational environment the service monitors
      attribute status and data as it moves through the system, providing near
      real-time monitoring of key components and indicating when pre-defined
      operating parameters are exceeded.

    * Ongoing persistance of design information and results during operation,
      providing assurances that designs are documented (and can be interrogated
      in the future), and can be re-used in the future.


How is the Documentation Structured
-----------------------------------

This documentation is divided into two sections:

    * The `User Guide <Getting Started>` provides information about how to work
      with your new environment.  The `Quick Start` guide within this contains
      everything you need to get up-and-running.  Subsequent sections provide
      more reference-focussed material describing functionality and capabilities
      in more detail.

    * The `System Maintenance Guide <architecture_>` describes how the system
      has been designed and implemented.  It also contains information on the
      routine maintenance activity you will need to perform to keep your system
      performing in an optimal way.


