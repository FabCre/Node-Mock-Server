const { buildBasicMockServer } = require('../basic-mock-server');

function createUserMock(request, response) {
    if (request.url.includes('user')) {
        response.end(JSON.stringify({ message: "User successfully Created" }));
    } else {
        response.end(JSON.stringify({ message: "User already exists" }));
    }
}

buildBasicMockServer({
    appName: 'Example Web Api',
    port: 3697,
    routes: [
        {
            path: '/users',
            response: require('./users.json')
        },
        {
            path: '/register',
            response: createUserMock,
        }
    ]
});
