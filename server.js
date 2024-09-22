const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

const fullName = 'ESWARA MANIKANTA CHANDRA PRASAD PERUMALLA';
const dob = '02102003';
const email = 'manikantaperumalla2102002@gmail.com';
const rollNumber = 'RA2111003010745';

function separateData(data) {
    const numbers = [];
    const alphabets = [];
    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else {
            alphabets.push(item);
        }
    });
    return { numbers, alphabets };
}

app.post('/bfhl', (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({ is_success: false, error: 'Invalid input' });
    }

    const { numbers, alphabets } = separateData(data);
    const highestAlphabet = alphabets.length ? [alphabets.sort((a, b) => b.localeCompare(a))[0]] : [];

    const response = {
        is_success: true,
        user_id: `${fullName.replace(/\s+/g, '_')}_${dob}`,
        email,
        roll_number: rollNumber,
        numbers,
        alphabets,
        highest_alphabet: highestAlphabet
    };

    res.json(response);
});

app.get('/bfhl', (req, res) => {
    const response = {
        operation_code: 1
    };

    res.status(200).json(response);
});

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
    });

    ws.send('Hello! Message From Server!!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
