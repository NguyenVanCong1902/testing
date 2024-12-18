const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8888 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Convert the message from Buffer to String
        const messageStr = message.toString();
        const data = JSON.parse(messageStr);

        console.log('Received message:', data);

        // Only broadcast relevant messages
        if (['offer', 'answer', 'candidate', 'hangup'].includes(data.type)) {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(messageStr);
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('Signaling server running on *:8888');