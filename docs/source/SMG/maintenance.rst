Maintenance
===========

Useful URLs
^^^^^^^^^^^

======================= ===========================================================
Code                     https://github.com/dls-controls/malcolmjs
Agile board              https://waffle.io/dls-controls/malcolmjs
Travis                   https://travis-ci.org/dls-controls/malcolmjs
Coverage                 https://codecov.io/gh/dls-controls/malcolmjs/
Docs                     http://malcolmjs.readthedocs.io/en/latest/
PyMalcolm Docs           http://pymalcolm.readthedocs.io/en/latest/
======================= ===========================================================

npm commands
^^^^^^^^^^^^

The main commands you are most likely to need during development are:
::

    npm start
    npm test
    npm e2e
    npm e2e:interactive
    npm lint:js
    npm storybook



======================= ===========================================================
``precommit``			the npm action performed before committing that runs the linter and the Prettier style fixer.
``server``              runs a test server with canned responses simulating a connection to Malcolm using websockets.
``server:dev``              the same as ``server`` but running using ``nodemon`` for live reload whilst developing the test server component
``start``               runs both the ``server:dev`` target and ``react-scripts start`` for live reloading of the MalcolmJS site.
``build``               create a production optimized build of the site
``test``                run the tests and report coverage
``test:watch``          the same as ``test`` but watches for file changes and re-runs automatically
``eject``               **This should be avoided at all costs so we can update create-react-app** a standard create-react-app command that generates all the config files and webpack settings as standalone files if custom editing needs to be done - this should be avoided unless absolutely necessary/delayed as long as possible
``cy:open``             open the cypress interactive runner
``cy:run``              run the cypress tests in a headless mode
``e2e:serve``           create a production build and serve both MalcolmJS and the websocket connection from the same process (otherwise the end-to-end tests don't exit without a fault on Travis)
``e2e:interactive``     runs ``e2e:serve``, waits for the server to start and then runs ``cy:open``
``e2e``                 runs ``e2e:serve``, waits for the server and then runs ``cy:run``
``lint:js``             runs ESLint on the javascript files in ``src/``
``lint:css``            runs stylelint on the css files in ``src/``
``storybook``           runs React Storybook for interactive development of the presentational components
``build-storybook``     builds a static site for the presentation components that can be hosted as a styleguide.
======================= ===========================================================


Running the dev server
^^^^^^^^^^^^^^^^^^^^^^

The MalcolmJS code base comes with a development server to simulate the messages that go to and from Malcolm.

To run the server you can run the ``server`` or ``server:dev`` npm commands, the server will be started as part of the ``npm start`` target.

This server only has very limited capability by returning canned responses captured from using PyMalcolm, as well as handling unsubscribing. For a more realistic scenario, MalcolmJS should be tested against a real instance of PyMalcolm.

More request/response pairs can be added by adding more files to ``canned_data`` as long as the names start ``request_`` and ``response_`` (see below).


Running pyMalcolm + PandA simulator & Generating canned data
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
As mentioned above, it is possible to run up a simulator for a PandABox and a corresponding pyMalcolm server to provide a more accurate and complete testing environment.
It is also necessary to do this to generate updated canned data responses for the simple dev server (required when pyMalcolm or the PandA software is updated).

Simulator
---------

In order to run the simulator, there are several things required:

#. PandABlocks-* config/binary files [server, FPGA, 2nd-FPGA, rootfs, webcontrol]
#. Latest version of pyMalcolm (clone from https://github.com/dls-controls/pymalcolm)
#. YAML config file for pyMalcolm

The appropriate versions of the PandABlocks-* components should be obtained from Tom Cobb; once they have been placed on a local machine,
the simulator can be started by running ``<path to pandablocks>/PandABlocks-server/simserver -f <path to pandablocks>/PandABlocks-FPGA`` from a terminal.

Once the simulator is running (should display "Server started" in last line of terminal), we can now start the pyMalcolm server;
this should be done by running ``<path to pymalcolm>/pymalcolm/malcolm/imalcolm.py <path to yaml>/<YAMLNAME>.yaml`` from a terminal.
The YAML file for pyMalcolm should contain the following:

.. code-block:: yaml

    - pandablocks.blocks.pandablocks_manager_block:
        config_dir: /tmp
        mri: PANDA
        hostname: 127.0.0.1

    - web.blocks.web_server_block:
        mri: WEB

Canned Data
-----------

Once the PandA simulator and pyMalcolm are running, it is possible to generate a fresh set of canned data. To do this, simply run the
canned_data_generator.py python script (located in *<malcolmJS root>/server/pyScripts*).
This will delete the contents of the *<malcolmJS root>/server/canned_data* folder and generate new json files for a set of pre-programmed blocks, subscribing to their meta and all their attributes.
Currently, these blocks are: ["PANDA", "PANDA:TTLIN1", "PANDA:INENC1", "PANDA:LUT1", "PANDA:SEQ1"], in addition to the list of all blocks available on the PANDA simulator.


