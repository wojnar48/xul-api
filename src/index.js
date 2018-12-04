require('dotenv').config({ path: '.env' });
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use the `cookie-parser` middleware to parse cookies
server.express.use(cookieParser());

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    }
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
);