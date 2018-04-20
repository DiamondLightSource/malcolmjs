MalcolmJS
=========

|buildstatus| |coverage| |readthedocs| |code analysis: airbnb| |code style: prettier|

MalcolmJS is a web application for interacting with Malcolm (typically inside
a PANDA box), allowing a view on the resulting attributes as well as being 
able to modify settings.

Malcolm is a middlelayer framework that implements high level configure/run
behaviour of control system components like those used in continuous scans.

Malcolm was created as part of the Mapping project at Diamond Light Source
in order to improve the performance of continuous scanning.

How is the documentation structured?
------------------------------------

The documentation is structured into two main sections; one targeted at end users and the other at developers/power users.

.. _installation_guide:

Installation Guide
------------------

- See settings up a development environment for more details of working with the MalcolmJS code base.
- See deploying a release to see how to run MalcolmJS.

.. _repository:
    https://github.com/dls-controls/malcolmjs    

.. _pymalcolm:
    https://github.com/dls-controls/pymalcolm

.. _jmalcolm:
    https://github.com/openGDA


.. |buildstatus| image:: https://travis-ci.org/dls-controls/malcolmjs.svg?branch=version1
    :target: https://travis-ci.org/dls-controls/malcolmjs
    :alt: Build Status

.. |coverage| image:: https://codecov.io/gh/dls-controls/malcolmjs/branch/version1/graph/badge.svg
    :target: https://codecov.io/gh/dls-controls/malcolmjs/branch/version1/
    :alt: Test coverage

.. |readthedocs| image:: https://readthedocs.org/projects/malcolmjs/badge/?version=latest
    :target: http://malcolmjs.readthedocs.org
    :alt: Documentation

.. |code analysis: airbnb| image:: https://img.shields.io/badge/code_analysis-eslint_airbnb-ff69b4.svg
    :target: http://airbnb.io/javascript/
    :alt: Code analysis: eslint - airbnb

.. |code style: prettier| image:: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
    :target: https://github.com/prettier/prettier
    :alt: Code style: prettier
