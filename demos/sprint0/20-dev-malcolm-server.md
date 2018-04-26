# 20 - Make a Malcolm socket simulator

## Demo

1. Start the dev server
    ```
    npm run server:dev
    ```
1. Start the interactive socket demo server
    ```
    cd demos/sprint0
    node ./interactive_socket.js
    ```
1. Send a canned message by typing in the console for the interactive socket server
    ```
    canned:TTLIN-meta
    ```
   and hit enter.
1. Observe the message being sent.
1. Observe the response that comes back, comment on the delay and how this is a setting in the server to simulate delayed responses.
1. Send
   ```
   canned:blah
   ```
   and observe the ERROR response that comes back
1. Send
   ```
   unsubscribe:41
   ```
   and observe the RETURN response that comes back
1. Send
    ```
    unsubscribe:77
    ```
    and observe the ERROR as that id isn't being subscribed to.
