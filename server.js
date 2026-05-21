const { WebSocketServer } = require('ws');

// Use the port Render automatically gives us, or default to 8080
const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`Chat backend server running on port ${PORT}`);

// Keep track of all connected browsers (clients)
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`A friend joined! Total active users: ${clients.size}`);

    ws.on('message', (message) => {
        // When someone sends a message, immediately broadcast it to everyone else
        for (const client of clients) {
            if (client.readyState === 1) { // 1 means OPEN
                client.send(message.toString());
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log(`Someone left. Total active users: ${clients.size}`);
    });
});
