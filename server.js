const http = require('http');
const app = require('./app');
const port = proccess.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port);

