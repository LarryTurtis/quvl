import http from 'http';
import app from './app';

const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`[quvl] server listening at http://localhost:${server.address().port}`);
});

const shutdown = () => {
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
