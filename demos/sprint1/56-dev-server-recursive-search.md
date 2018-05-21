# 56 - recursive search on dev server

## Demo
1. Start the dev server
    ```
    npm run server:dev
    ```
1. Start the interactive socket demo client
    ```
    cd demos/sprint0
    node ./interactive_socket.js
    ```
1. Send a canned message by typing in the console for the interactive socket client
    ```
    canned:PANDA/TTLIN1/request_meta.json
    ```
   and hit enter.
1. Observe the message being sent.
1. Observe the response that comes back
1. Comment on how the dev server loads all files under the ``canned_data`` folder.