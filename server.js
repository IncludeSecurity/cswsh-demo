const http = require('http');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');

const app = express();
app.use(cookieParser('A RANDOM SECRET'));

const server = http.createServer(app);

app.get('/', (req, res) => {
    console.log("GET /")
    let options = {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: "/"
    };

    res.cookie('cookieName', 'cookieValue', options);
    res.send('Cookie set');
});

app.post('/', (req, res) => {
    console.log("POST /");
    const cookies = req.headers.cookie;
    console.log('- Request Cookies:', cookies);
    res.send(cookies);
});

var corsOptions = { origin: true };

app.options('/reflected', cors(corsOptions));
app.post('/reflected', cors(corsOptions), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    console.log("POST /reflected");
    const cookies = req.headers.cookie;
    console.log('- Request Cookies:', cookies);
    res.send(cookies);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    console.log("Websocket connection")
    const cookies = req.headers.cookie;
    console.log('- Request Cookies:', cookies);

    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    ws.send('Hello from WebSocket server');
});

server.listen(3000, () => {
    console.log(`Server started on port ${server.address().port}`);
});

