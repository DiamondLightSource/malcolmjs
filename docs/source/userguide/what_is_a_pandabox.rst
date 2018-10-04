.. _welcome_to_your_pandabox_:

Getting Started
===============

Introduction
------------

This user guide introduces the web-based environment, toolkit and processes available to you as you develop and manage your Control System through our integrated solution.  These utilise the `Malcolm middleware <https://pymalcolm.readthedocs.io/en/latest/>`_ library to provide a visual environment allowing you to:

    * Design and configure the building blocks and linkages between them as a *virtual model* of you control system.
    * Optimise your design through interaction with the physical hardware of your control system implementation.
    * Utilise and manage your design in in real-world operational scenarios through monitoring and basic analysis tools.
    * Export your design for re-use in analogous scenarios.


Technical Summary
-----------------

The interactive environment we provide is a visual representation of the underlying functionality provided by the `Malcolm middleware <https://pymalcolm.readthedocs.io/en/latest/>`_ library, which itself provides a common interface to a range of control system and data management technologies.  Our user environment does not provide direct access to hardware components.  Information about the hardware components themselves, and the data they generate, is shared with our user environment via Malcolm.  This allows you to generate a *virtual model* of your control system before providing design and configuration information about it to Malcolm via a dedicated service.  Malcolm takes this information and uses it to interface with the underlying physical hardware.  We can consider this schematically as:

**IMAGE**

The Malcolm Server provides three key services:

    * Details of the building blocks available to the user environment, allowing a System Designer or Implementors to construct and model the control system realistically using a library of defined building blocks together with their attributes and methods, and linking them together to create larger control system designs.  During this process design decisions can be validated against parameters to ensure validity of the design.
    * Once deployed into an operational environment the service monitors attribute status and data as it moves through the system, providing near real-time monitoring of key components and raising alarms when pre-defined operating parameters are exceeded.
    * Ongoing persistance of design information and results during operation, providing assurances that designs are documented (and can be interrogated in the future), and can be re-used if required in analogous exploitation scenarios in the future.

.. NOTE::   
    On intially creating a new design each component is configured according to its pre-defined default specification as defined within the underlying hardware definion accessed by Malcolm.


How is the Documentation Structured
-----------------------------------

This User Guide is divided into several sections:

    * For those wanting a brief high-level introduction to web interface functionality allowing them to quickly understand the key capabilities it provides see the `Quick Start <quick_start_guide_>`.
    * For those requiring a more detailed description of the User Interface see the 'user_interface_overview_` section.
    * Details of how to create and manage designs representing your underlying hardware are covered in `working_with_a_design_`.
    * Once familiar with the concepts of the User Interface and Design-focussed approach detailed support documentation is provided covering specific aspects of the Web Interface and your interaction with it.



