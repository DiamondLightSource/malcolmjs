Maintenance
==============

Useful URLs
^^^^^^^^^^^^^^^^

======================= ===========================================================
Code                     https://github.com/dls-controls/malcolmjs
Agile board              https://waffle.io/dls-controls/malcolmjs
Travis                   https://travis-ci.org/dls-controls/malcolmjs
Coverage                 https://codecov.io/gh/dls-controls/malcolmjs/
Docs                     http://malcolmjs.readthedocs.io/en/latest/
PyMalcolm Docs           http://pymalcolm.readthedocs.io/en/latest/
======================= ===========================================================

npm commands
^^^^^^^^^^^^^^^^

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
^^^^^^^^^^^^^^^^^^^^^^^^

The MalcolmJS code base comes with a development server to simulate the messages that go to and from Malcolm.

To run the server you can run the ``server`` or ``server:dev`` npm commands, the server will be started as part of the ``npm start`` target.

This server only has very limited capability by returning canned responses captured from using PyMalcolm, as well as handling unsubscribing. For a more realistic scenario, MalcolmJS should be tested against a real instance of PyMalcolm.

More request/response pairs can be added by adding more files to ``canned_data`` as long as the names start ``request_`` and ``response_``.


