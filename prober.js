const axios = require('axios');

const URL = 'http://localhost:3000/api/data';

const payloads = [
    {
        name: 'Safe Request',
        data: { username: 'john_doe', message: 'Hello world' },
        expected: 200
    },
    {
        name: 'SQL Injection Attack',
        data: { username: "admin' OR '1'='1", message: 'Stealing data' },
        expected: 403
    },
    {
        name: 'XSS Attack',
        data: { username: 'attacker', message: '<script>alert("hacked")</script>' },
        expected: 403
    },
    {
        name: 'NoSQL/Regex Attack',
        data: { username: { "$gt": "" }, password: "password123" },
        expected: 403 // Currently caught by general string check in this demo
    }
];

async function runTests() {
    console.log('--- STARTING GUARDRAIL SECURITY PROBE ---');
    
    for (const payload of payloads) {
        try {
            console.log(`Testing: ${payload.name}...`);
            const response = await axios.post(URL, payload.data);
            console.log(`  Result: Status ${response.status} (Allowed)`);
            if (response.status !== payload.expected) {
                console.error(`  [FAILED] Expected ${payload.expected}, but got ${response.status}`);
            }
        } catch (error) {
            const status = error.response ? error.response.status : 'ERR';
            console.log(`  Result: Status ${status} (Blocked)`);
            if (status !== payload.expected) {
                console.error(`  [FAILED] Expected ${payload.expected}, but got ${status}`);
            }
        }
    }
    
    console.log('--- PROBE COMPLETE ---');
}

// Small delay to ensure server is up if run together
setTimeout(runTests, 2000);
