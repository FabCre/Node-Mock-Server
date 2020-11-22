const http = require("http");

const COLOR_RED = "\x1b[31m";
const COLOR_GREEN = "\x1b[32m";
const COLOR_YELLOW = "\x1b[33m";
const COLOR_WHITE = "\x1b[37m";

const DEFAULT_CONFIG = {
    appName: "basic-mock-server",
    port: 3698,
    routes: [{
        path: '/readme',
        response: require("./readme.json"),
    }]
}

const responseCache = {};

function requestHandler(routes) {
    return (request, response) => {
        const routeDefinition = routes.find(route => request.url.includes(route.path))

        if (routeDefinition === undefined) {
           console.log(COLOR_YELLOW, request.url, "404", COLOR_WHITE);
           response.statusCode = 404;
           response.end();
           return;
        }

        const fromCache = responseCache[request.url];

        if (fromCache !== undefined) {
            console.log(COLOR_GREEN, request.url, "200 (from cache)", COLOR_WHITE);
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Header", "*");
            response.end(fromCache);
            return;
        }

        let strResponse = "";
        if (typeof routeDefinition.response === "object") {
            strResponse = JSON.stringify(routeDefinition.response);
            responseCache[request.url] = strResponse;
        } else if (typeof routeDefinition.response === "function") {
            strResponse = routeDefinition.response(request, response);
        }

        console.log(COLOR_GREEN, request.url, "200", COLOR_WHITE);
        if (strResponse !== undefined) {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Header", "*");
            response.end(strResponse);
        }
    }
}

/**
 *  @param config { appName: string; port: number; routes: { path: string; response: object | (request, response) => object } }
 *
 * responseHandler: (response, request) => responseBodyObject
 * see: https://nodejs.org/api/http.html
 */
function buildBasicMockServer(config) {
    const serverConfig = {
        ...DEFAULT_CONFIG,
        ...config,
        routes: [...config.routes, ...DEFAULT_CONFIG.routes]
    };

    const server = http.createServer(requestHandler(serverConfig.routes));

    server.listen(serverConfig.port, error => {
        if (error) {
            return console.error(COLOR_RED, "Something wrong happened", error.stack, COLOR_WHITE);
        }
        console.log(`${serverConfig.appName} is listening on ${serverConfig.port}`)
    })
}

exports.buildBasicMockServer = buildBasicMockServer;