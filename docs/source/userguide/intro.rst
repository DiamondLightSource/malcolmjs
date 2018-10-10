Introduction
============

**ORIGINAL TEXT FROM TOM***
This guide aims to give you information about what the different parts of MalcolmJS are as well as a guide on how to navigate and use the interface.

The blocks and details will all depend on your particular instance of Malcolm but the ideas and principles will be the same.
**END OF ORIGINAL TEXT**


Technical Summary
-----------------

The interactive environment we provide is a visual representation of the underlying functionality provided by the `Malcolm middleware <https://pymalcolm.readthedocs.io/en/latest/>`_ library, which itself provides a common interface to a range of control system and data management technologies.  Our user environment does not provide direct access to hardware components.  Information about the hardware components themselves, and the data they generate, is shared with our user environment via Malcolm.  This allows you to generate a virtual representation of your control system before providing design and configuration information about it to Malcolm via a dedicated service.  Malcolm takes this information and uses it to interface with the underlying physical hardware.  We can consider this schematically as:

**IMAGE**

The Malcolm Server provides three key services:

    * Details of the building blocks available to the user environment, allowing a System Designer or Implementors to construct and model the control system realistically using a library of defined building blocks together with their attributes and methods, and linking them together to create larger control system designs.  During this process design decisions can be validated against parameters to ensure validity of the design.
    * Once deployed into an operational environment the service monitors attribute status and data as it moves through the system, providing near real-time monitoring of key components and raising alarms when pre-defined operating parameters are exceeded.
    * Ongoing persistance of design information and results during operation, providing assurances that designs are documented (and can be interrogated in the future), and can be re-used if required in analogous exploitation scenarios in the future.

.. NOTE::   
    On intially creating a new design each component is configured according to its pre-defined default settings.  We use Malcolm to retrieve this information from the underlying Design Specification for that component.


How is the Documentation Structured
-----------------------------------

This documentation is divided into several sections:

    * A **User Guide** providing information about how to work with your new environment.  The `quick_start_guide_` contains everything you need to get up and running, with more reference-focussed material describing functionality and capabilities in more detail.
    * A **System Maintenance Guide** describing how the system has been designed and implemented.  It also contains information on the routine maintenance activity you will need to perform to keep your system performing in an optimal way.
    * Reference material on **Malcolm**, the underlying technology used to power your new environment.
    * ANYTHING ELSE...

