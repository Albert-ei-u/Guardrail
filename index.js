const { execSync } = require('child_process');
const path = require('path');

// Fallback Regex Patterns (Mirrors Rust Core)
const PATTERNS = {
    SQLI: [
        /union\s+select/i,
        /select\s+.*\s+from/i,
        /insert\s+into/i,
        /drop\s+table/i,
        /--/i,
        /'\s*OR\s*'\d+'\s*=\s*'\d+/i
    ],
    XSS: [
        /<script.*?>/i,
        /javascript:/i,
        /onload\s*=/i,
        /onerror\s*=/i,
        /<iframe.*?>/i
    ]
};

/**
 * Guardrail Core Logic
 * In a production build, this would call the compiled Wasm module.
 */
function checkPayload(input) {
    if (typeof input !== 'string') return { isSafe: true };

    for (const pattern of PATTERNS.SQLI) {
        if (pattern.test(input)) {
            return { isSafe: false, threatLevel: 'High', attackType: 'SQL Injection' };
        }
    }

    for (const pattern of PATTERNS.XSS) {
        if (pattern.test(input)) {
            return { isSafe: false, threatLevel: 'High', attackType: 'XSS' };
        }
    }

    return { isSafe: true };
}

/**
 * Express Middleware
 */
function guardrail(options = {}) {
    return (req, res, next) => {
        const payload = JSON.stringify({
            body: req.body,
            query: req.query,
            params: req.params
        });

        const result = checkPayload(payload);

        if (!result.isSafe) {
            
            console.error(`[GUARDRAIL ALERT] ${result.attackType} detected!`);
            
            if (options.block === false) {
                req.guardrail = result;
                return next();
            }

            return res.status(403).json({
                error: 'Security Breach Detected',
                message: 'Your request has been blocked by Guardrail Security.',
                type: result.attackType
            });
        }

        next();
    };
}

module.exports = {
    guardrail,
    checkPayload
};
