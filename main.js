const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

const uidmapping = {};

wss.on('connection', function connection(ws) {
    console.log("New connection")
    let identityHasBeenReceived = false;
    let identity;

    ws.on('message', function incoming(message) {
        console.debug(message);
        if (!identityHasBeenReceived) {
            // Very insecure, we will take the user's identity for who they say they are
            identity = message;
            uidmapping[message] = ws;
            identityHasBeenReceived = true;
        } else {
            const payload = JSON.parse(message);

            uidmapping[payload.target].send(JSON.stringify({
                author: identity,
                ...payload
            }));
        }
    });

    ws.on("close", () => {
        uidmapping[identity] = null;
    });
});
