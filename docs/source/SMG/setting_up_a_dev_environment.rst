Setting up a Development Environment
=====================================

Code Development
##################




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

	sphinx-build -b html docs/source docs/build/html


To then serve the built documentation you need to have a system for serving a static site. A recommended option is the npm package ``http-server`` which can be installed with ``npm i -g http-server``), then the docs are served with:
::

    http-server .\docs\build\html\ -p 4000


The diagrams are all made with `draw.io <https://www.draw.io/>`_ and the files exported as xml so they can be versioned in this code base and edited by others. If you edit the diagrams you should export a copy of the updated xml back to the ``architectural_diagrams`` folder as well as an updated ``png``.

