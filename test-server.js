const express = require('express');
const { guardrail } = require('./index');

const app = express();
app.use(express.json());

// Apply Guardrail protection
app.use(guardrail());

app.post('/api/data', (req, res) => {
    res.json({ message: 'Success! Your data was processed safely.', data: req.body });
});

app.get('/', (req, res) => {
    res.send('<h1>Guardrail Protected Server</h1><p>Try sending an attack payload to /api/data</p>');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Guardrail Demo Server running on http://localhost:${PORT}`);
});
