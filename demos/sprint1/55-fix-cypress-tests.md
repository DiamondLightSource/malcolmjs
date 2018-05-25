# 55 - Bug: Fix cypress tests so they work with routes other than /

Cause of issue:

The dev server wasn't configured to redirect to index.html so that the react router doesn't kick in.

## Demo
1. run 
    ```
    npm run e2e:interactive
    ```
1. run the malcolmJS test suite
1. show that the browser window gets populated with the malcolmJS interface
