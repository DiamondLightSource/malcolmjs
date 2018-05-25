Setting up a Development Environment
=====================================

Code Development
##################

To develop MalcolmJS you need a stable version of `node <https://nodejs.org/en/>`_ (>=8.9.0) and your OS needs to be able to run Chromium (for the end-to-end tests) - this means RHEL 7 or above but Windows has also been used as a development environment.

You will also need a git client of some form and then you can clone the code from `the MalcolmJS github page <https://github.com/dls-controls/malcolmjs>`_

Navigate to the root of the repository and run
::

    npm install

This will install all dependencies and development dependencies to run and develop MalcolmJS.

The available commands for developing with are listed in ``package.json`` as well as being documented in the :ref:`Maintenance` chapter; 
all commands are runnable from the shell using node so should be cross platform. 

However, the main commands needed to develop are:
::

    npm start
    npm run storybook
    npm test
    npm run e2e


While in theory you can develop the code in any text editor, it is recommended that some form of IDE is used with syntax support for JavaScript and React. Both Webstorm and Visual Studio Code were used during this latest phase of development.


Documentation Development
##############################

The documentation is all in reStructuredText. The documentation can be edited in any text editor but some editors provide extra support for viewing a preview of the result (e.g. Sublime Text).

The final documentation is built for `Read the Docs <https://readthedocs.org/>`_ using `Sphinx <http://www.sphinx-doc.org/en/master/>`_.

To build the final documentation locally you need to have ``Python`` and ``pip`` installed, then you need to install ``Sphinx`` and ``sphinx-rtd-theme`` using:
::

    pip install Sphinx
    pip install sphinx-rtd-theme

Then to run the sphinx build run:
::

	npm run build-docs

The same build step can be done by running the ``Makefile`` in the root of the repo.

You can then open ``.\docs\build\html\index.html`` in a browser to view the results.


The diagrams are all made with `draw.io <https://www.draw.io/>`_ and the files exported as xml so they can be versioned in this code base and edited by others. If you edit the diagrams you should export a copy of the updated xml back to the ``architectural_diagrams`` folder as well as an updated ``png``.

