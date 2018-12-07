require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use the `cookie-parser` middleware to parse cookies
server.express.use(cookieParser());

// Create a middleware to decode the JWT token that lives in
// cookies so that we have a user ID on each request.
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  // call the next middleware in the chain
  next();
});

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