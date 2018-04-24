Deployment
===========

The continuous integration environment using Travis automatically deploys the built code bundle to Github when a particular commit is tagged. Therefore, to release MalcolmJS all you need to do is tag a commit and push that tag back to the server.

Once the resulting build is complete then the release will appear in the list of `MalcolmJS releases <https://github.com/dls-controls/malcolmjs/releases>`_.

Tags should take the form major.minor.patch ``#.#.#``, the artifacts then use ``git describe`` to append the number of commits since the tag as well as the SHA if relevant.

The resulting code package can then be downloaded and bundled into a deployment of PyMalcolm. Alternatively you can statically serve the bundle locally using something like the npm package ``http-server``.