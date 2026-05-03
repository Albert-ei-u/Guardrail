const express = require('express');
const path = require('path');
const { guardrail } = require('./index');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve the dashboard

// In-memory log of security events
let securityEvents = [];

// Apply Guardrail protection with custom logging
app.use((req, res, next) => {
    const start = Date.now();
    
    // Wrap res.send to capture status
    const oldSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - start;
        securityEvents.unshift({
            timestamp: new Date().toLocaleTimeString(),
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            payload: req.body,
            blocked: res.statusCode === 403
        });
        if (securityEvents.length > 50) securityEvents.pop();
        return oldSend.apply(res, arguments);
    };
    
    next();
});

app.use(guardrail());

app.post('/api/data', (req, res) => {
    res.json({ message: 'Success! Your data was processed safely.', data: req.body });
});

// Endpoint for the dashboard to get logs
app.get('/api/events', (req, res) => {
    res.json(securityEvents);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🛡️  Guardrail Demo Dashboard: http://localhost:${PORT}`);
    console.log(`📡 API Endpoint: http://localhost:${PORT}/api/data\n`);
});
