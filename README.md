# Node-Mock-Server

## How it works

- Simple `index.js` which exports a function called `buildBasicMockServer`
- Use this function to build easily a json mock server
- Let us create a simple mock server with js object as response or with a function that create a js object
- Pure Node.JS, no dependencies needed
- Log every request with status code (200, 404) with color
- Manage a simple cache to reduce js object serialization

## Example

``` JavaScript
const { buildBasicMockServer } = require('../basic-mock-server');

// Pass a config object to build the mock server
buildBasicMockServer({
    appName: 'Example Web Api',
    port: 3697,
    routes: [
        {
            // Routes that contains "/users"
            path: "/users",
            // Path to the json that will be return as reponse body
            response: require("./users.json")
        }
    ]
});
```