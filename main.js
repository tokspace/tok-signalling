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
            // Very insecure, we will take the user's identity for who they say they are
            identity = message;
            console.debug(`New connection from ${identity}`)
            connections[message] = ws;
        } else {
            const payload = JSON.parse(message);
            console.debug(`Got message ${JSON.stringify(payload.data)} from ${identity}`)
            if (connections[payload.target]) {
                console.log(`sending to ${payload.target}`)
                connections[payload.target].send(JSON.stringify(payload.data))
            }
        }
    });

    ws.on("close", () => {
        connections[identity] = null;
    });
});
