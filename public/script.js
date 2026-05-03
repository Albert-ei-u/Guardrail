const API_URL = '/api/data';
const EVENTS_URL = '/api/events';

// Simulates different payloads
async function simulate(type) {
    let payload = {};
    
    switch(type) {
        case 'safe':
            payload = { username: 'albert', message: 'Hello guardrail!' };
            break;
        case 'sqli':
            payload = { username: "admin' OR '1'='1", message: 'Hacking...' };
            break;
        case 'xss':
            payload = { username: 'attacker', message: '<script>alert(1)</script>' };
            break;
        case 'nosql':
            payload = { username: { "$gt": "" }, password: "123" };
            break;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        await response.json();
    } catch (err) {
        console.error('Request failed', err);
    }
    
    // Refresh the logs after a short delay
    setTimeout(updateLogs, 500);
}

async function updateLogs() {
    const response = await fetch(EVENTS_URL);
    const events = await response.json();
    
    const logBody = document.getElementById('event-log');
    logBody.innerHTML = events.map(event => `
        <tr>
            <td>${event.timestamp}</td>
            <td>${event.method}</td>
            <td>${event.path}</td>
            <td><span class="status-badge ${event.blocked ? 'status-blocked' : 'status-success'}">${event.status}</span></td>
            <td>${event.duration}</td>
            <td>${event.blocked ? '🛡️ BLOCKED' : '✅ ALLOWED'}</td>
        </tr>
    `).join('');

    // Update Robustness Score
    if (events.length > 0) {
        const blocked = events.filter(e => e.blocked).length;
        const attacks = events.filter(e => e.status !== 200).length; // Anything not 200 is likely a blocked attack or error
        const score = attacks > 0 ? Math.round((blocked / attacks) * 100) : 100;
        document.getElementById('score-value').innerText = score;
    }
}

function clearLogs() {
    // In a real app, this would call a DELETE endpoint
    document.getElementById('event-log').innerHTML = '';
}

// Polling for live updates
setInterval(updateLogs, 3000);
updateLogs();
