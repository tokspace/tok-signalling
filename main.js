const WebSocket = require('ws');

let port = process.execArgv[1] || 8080;

const wss = new WebSocket.Server({
    port: port
}, function () {
    console.info(`WebSocket server started on port ${port}`);
});

const connections = {};

wss.on('connection', function connection(ws) {
    let identity;

    ws.on('message', function incoming(message) {
        if (identity === undefined) {
            console.debug(`New connection from ${message}`)
            // Very insecure, we will take the user's identity for who they say they are
            identity = message;
            connections[message] = ws;
        } else {
            const payload = JSON.parse(message);

            if (connections[payload.target]) connections[payload.target].send(JSON.stringify({
                author: identity,
                ...payload
            }));
        }
    });

    ws.on("close", () => {
        connections[identity] = null;
    });
});
