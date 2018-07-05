Developer Workflow
=====================================

Workflow
^^^^^^^^^^^^^^^^^^^^^^

#. Select a story from the waffle board.
#. Pull the latest version of the ``version1`` branch
#. Create a branch from there called ``feature/{insert general name of story}-#{story number}``
#. Put the story into ``In Progress`` on the waffle board
#. Repeatedly during development:
  
   #. Develop code/write tests
   #. Ensure all tests pass
   #. Run linter and fix issues
   #. Commit
   #. (optionally) push to ``origin``

#. Merge ``origin/version1`` into your feature branch.
#. Run unit tests
#. Check impact on coverage
#. Run e2e tests
#. Push to ``origin``
#. Make a pull request
#. Put the story into ``Review`` on the waffle board
#. Get the pull request reviewed
#. Wait for the automated build on Travis
#. Once a pull request is approved then it can be merged back into ``origin/version1``
#. Move the story to ``Review complete``
#. Wait for the merge build to complete on Travis
#. Move the story to ``Done``

Story State Transitions
^^^^^^^^^^^^^^^^^^^^^^^

Branching Strategy
^^^^^^^^^^^^^^^^^^

Code Development and Testing
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Preparing for a Pull Request
^^^^^^^^^^^^^^^^^^^^^^^^^^^^


Pull Request Procedure
^^^^^^^^^^^^^^^^^^^^^^

When a branch is ready to be merged back in then you should create a pull request in GitHub. The description should contain:

- A general description of the changes in the pull request
- A link for waffle to connect the PR to the issue (``connect to #{issue number}``)
- A method for testing the changes, particularly if they are visual in nature (e.g. describe which StoryBook story to look at or which url to visit). You may also want to consider adding a screenshot of the changes.

**If this is your first time reviewing then you will need a development environment set up first, see** :ref:`Setting up a Development Environment`

Before approving, a reviewer should:

- review the code
- ensure the build passes
- assess the impact on code coverage
- run the method for testing as described by the developer as assess the visual impact of the changes

Monitoring Progress in a Sprint
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^