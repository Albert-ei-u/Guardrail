# Guardrail 🛡️

**Guardrail** is an automated, language-agnostic security system designed to protect web applications from common vulnerabilities and provide continuous security testing.

## 🌟 Features

- **The Shield**: A high-performance middleware layer that blocks SQL Injection, XSS, and malicious payloads in real-time.
- **The Prober**: An automated "Chaos Security" engine that simulates attacks to test your application's robustness.
- **Rust Core**: A memory-safe, ultra-fast security engine that compiles to WebAssembly for cross-language compatibility.
- **Agnostic Design**: Built to eventually support Node.js, Python, Go, and more using a unified Rust-based logic.

## 🚀 Quick Start 

### 1. Installation
```bash
git clone https://github.com/Albert-ei-u/Guardrail.git
cd Guardrail
npm install
```

### 2. Run the Demo
Start the protected server:
```bash
npm start
```

### 3. Run Security Tests
In a separate terminal, launch the automated security probe:
```bash
npm run probe
```

## 📂 Project Structure

- `index.js`: The Node.js SDK and Middleware.
- `src/lib.rs`: The Rust-based security engine source code.
- `prober.js`: The automated attack simulator.
- `test-server.js`: A demonstration environment.
- `Cargo.toml`: Configuration for the Rust ecosystem.

## 🛠️ Development

### Building the Rust Core (Requires Rust & wasm-pack)
```bash
npm run build:core
```

## 📄 License
MIT
