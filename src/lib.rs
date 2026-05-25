use wasm_bindgen::prelude::*;
use regex::Regex;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct SecurityResult {
    pub is_safe: bool,
    pub threat_level: String,
    pub attack_type: Option<String>,
}

#[wasm_bindgen]
pub fn check_payload(input: &str) -> JsValue {
    let mut result = SecurityResult {
        is_safe: true,
        threat_level: "Low".to_string(),
        attack_type: None,
    };

    // SQL Injection Patterns
    let sqli_patterns = [
        r"(?i)union\s+select",
        r"(?i)select\s+.*\s+from",
        r"(?i)insert\s+into",
        r"(?i)drop\s+table",
        r"(?i)--",
        r"(?i)'\s*OR\s*'\d+'\s*=\s*'\d+",
    ];

    // XSS Patterns
    let xss_patterns = [
        r"(?i)<script.*?>",
        r"(?i)javascript:",
        r"(?i)onload\s*=",
        r"(?i)onerror\s*=",
        r"(?i)<iframe.*?>",
    ];

    for pattern in sqli_patterns.iter() {
        let re = Regex::new(pattern).unwrap();
        if re.is_match(input) {
            result.is_safe = false;
            result.threat_level = "High".to_string();
            result.attack_type = Some("SQL Injection".to_string());
            return serde_json::to_value(&result).unwrap().into();
        }
    }

    for pattern in xss_patterns.iter() {
        let re = Regex::new(pattern).unwrap();
        if re.is_match(input) {
            result.is_safe = false;
            result.threat_level = "High".to_string();
            result.attack_type = Some("XSS".to_string());
            return serde_json::to_value(&result).unwrap().into();
        }
    }

    serde_json::to_value(&result).unwrap().into()
}
