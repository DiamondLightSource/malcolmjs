.. _working_with_tables_:

Working With Attribute Tables
=============================

An Attribute associated with a Block may itself represent a collection of values which, when taken together, define the overall Attribute.  For example, the Sequencer Block type contains a single Attribute defining the sequence of steps performed by underlying hardware when controlling motion of a motor.   

The collection of values required by the Attribute are presented in the User Interface as an Attribute Table.  The template for the table is generated dynamically based on the specification of the Attribure within its Block.  For details of utilising the table associated with a specific Attribute refer to the technical documentation of its Block.


Identifying Table Attributes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A Table Attribute can be idenitifed by the 'View' option associated with it.  Selecting the 'View' option opens the Attribute Table within the 'Central Panel' of the User Interface.


Specifying Attribute Table Content
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Upon opening an Attribute Table you are presented with details of the content of that Attribute, and the ability to define values.  Like Attributes themselves these values may be selected from a list of pre-defined options, selectable enable/disable options, or text/numerical inputs.

After adding values the content of the table must be submitted for processing and recording within the overall system Design.  To submit an Attribute Table:

    #. Select the 'Submit' option at the bottom of the Attribute Table.
    
Updates and changes within the table can be discarded at any time throughout the modification process without impacting the currently recorded specification.  To discard changes:

    #. Select the 'Discard Changes' option at the bottom of the Attribute Table.


Static vs. Dynamic Attribute Tables
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Depending on the specification of a table-based Attribute in its underlying Block the Attribute Table presented may be static or dynamic in nature.

*Static* Attribute Tables contain a pre-defined number of columns and rows describing the information required for that Attribute.  All fields must be completed in order to fully define the Attribute.

.. NOTE::
    For large or complex tables it is possible to submit an incomplete table in order to record the values entered at the time of submission.

*Dynamic* Attribute Tables contain a pre-defined number of columns but allow for a varying number of rows.  At least one row must be present to define the Attribute but typically more will be required to fully describe its behaviour. 

New rows are added to the table in one of two ways:

    * To add a new row to the end of the table select the '+' option below the current last row entry.  A new row is created.
    * If the order in which table entries are specified is important (for example in the case of describing a sequence of activities), rows can be added before or after previously defined rows as follows:

        #. With the Attribute Table displayed select the 'edit' icon associated with an existing row entry or 'information' icon associated with a new row.  The information panel associated with the row is displayed on the right-hand side.
        #. To insert a new row *above* the current one select the 'Add' option associated with the 'Insert row above' field.
        #. To insert a new row *below* the current one select the 'Add' option associated with the 'Insert row below' field.

Rows that have been previously specified can be removed by deleting them from the Attribute Table.  To remove a row:

    #. Identify the row to be removed.
    #. Select the information icon assoicated with the row.  It's information panel is displayed on the right-hand side.
    #. Select the 'Delete' option associated with the 'Delete row' field.
