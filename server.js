const path = require('path');

// Set default fallback environment variables for Render deployment if not already set
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://varunmittapalli2005_db_user:nYHH9Kt0RXtj6zAV@cluster0.tmhyjqq.mongodb.net/?appName=Cluster0';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'roadside_aaa_dev_secret_key_2026';

// Resolve the absolute path of the backend entry point
const backendServerPath = path.resolve(__dirname, 'backend', 'server.js');

// Change the current working directory to the backend folder
// This ensures relative paths inside backend/ (like .env and local modules) resolve properly
process.chdir(path.join(__dirname, 'backend'));

console.log(`[Root Wrapper] Changing directory to: ${process.cwd()}`);
console.log(`[Root Wrapper] Launching backend server from: ${backendServerPath}`);

// Start the actual backend server
require(backendServerPath);
