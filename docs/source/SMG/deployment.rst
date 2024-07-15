Deployment
==========

The continuous integration environment using Travis automatically deploys the built code bundle to Github when a particular commit is tagged. Therefore, to release MalcolmJS all you need to do is tag a commit and push that tag back to the server.

Once the resulting build is complete then the release will appear in the list of `MalcolmJS releases <https://github.com/DiamondLightSource/malcolmjs/releases>`_.

Tags should take the form major.minor.patch ``#-#-#``, the artifacts then use ``git describe`` to append the number of commits since the tag as well as the SHA if relevant.

The resulting code package can then be downloaded and bundled into a deployment of PyMalcolm. Alternatively you can statically serve the bundle locally using something like the npm package ``http-server``.

Authentication
--------------

The recommended way to authenticate is to use a GitHub OAuth token. It must have the ``public_repo`` or ``repo`` scope to upload assets.
Instead of setting it up manually, it is highly recommended to use ``travis setup releases``, which automatically creates and encrypts a GitHub oauth token with the correct scopes.

This results in something similar to:

.. code-block:: yaml

  deploy:
    provider: releases
    api_key:
      secure: YOUR_API_KEY_ENCRYPTED
    file: "FILE TO UPLOAD"
    skip_cleanup: true
    on:
      tags: true::

If doing this from within Diamond, one should generate keys using the ``DiamondLightSource-user`` GitHub account (login details available from Controls password vault).
Travis CLI tools can be obtained by loading the Ruby module with ``module load ruby``.
