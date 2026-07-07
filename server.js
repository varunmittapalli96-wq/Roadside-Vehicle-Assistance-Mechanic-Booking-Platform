const path = require('path');

// Resolve the absolute path of the backend entry point
const backendServerPath = path.resolve(__dirname, 'backend', 'server.js');

// Change the current working directory to the backend folder
// This ensures relative paths inside backend/ (like .env and local modules) resolve properly
process.chdir(path.join(__dirname, 'backend'));

console.log(`[Root Wrapper] Changing directory to: ${process.cwd()}`);
console.log(`[Root Wrapper] Launching backend server from: ${backendServerPath}`);

// Start the actual backend server
require(backendServerPath);
