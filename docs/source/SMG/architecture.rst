Architecture
============

Context
########

TODO: context diagram

10K ft description of MalcolmJS

Containers
###########

TODO: container diagram

Description of container level

Components
############

TODO: diagram of components

Description of components



Technologies
#############

The technology stack selection has been based on the principles of:

- Making use of **Open Source Software**
- Selecting modern, well supported frameworks to ensure long term sustainability (within the bounds of the previous principle)
- Fitting in with Diamond processes where there are clearly defined technology choices for consistency

By Component
^^^^^^^^^^^^^
- **MalcolmJS redux components**
    A set of components for handling socket communication with Malcolm that intercepts messages intended for Malcolm and sends them, as well as injecting responses back into the Redux one-way data flow. 
- **MalcolmJS attribute components** 
    A set of presentation only react components that could be distributed as an npm package for other people to develop MalcolmJS dashboards with.
- **Remaining MalcolmJS presentation components** 
    The other container components needed to layout the MalcolmJS site and wire the presentational compoenents up to the MalcolmJS redux components.

Tools
^^^^^^^^

- List tools here

Languages
^^^^^^^^^^^

- List languages here

Frameworks
^^^^^^^^^^^^

- List frameworks here


Quality
###############

Coding Standards
^^^^^^^^^^^^^^^^^^^

- Discuss static analysis
- Discuss code coverage
- Discuss pull requests
- Discuss gated PRs

Security
^^^^^^^^^

TODO

Testing
^^^^^^^^^

As much effort as possible should be made to automate unit, integration and system testing. MalcolmJS will use as much unit testing as possible, as well as running end-to-end tests against a test server that mimics the socket responses. This should mean very few system tests are needed as we can expand the socket responses of the test server to cover these cases. Where system tests are needed then they will need to be done manually as they will need to be run against an actual PANDA box but could still be based off scripted tests (e.g. using cypress).

Given we are developing a website, usability testing will also be important so we should plan to get some engineers to do some testing and gather their feedback.

One of the big issues with versions prior to version 1 was performance and the time taken to re-render updates. We should also put additional effort into performance testing to make sure the page is at least usable (i.e. it doesn't need to be lightning fast but shouldn't freeze up, it should at least indicate to the user it is still responding but could be waiting for a response).
