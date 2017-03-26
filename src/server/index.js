import http from 'http';
import app from './app';

const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`[serverbid] server listening at http://localhost:${server.address().port}`);
});

const shutdown = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[serverbid] server shutting down');
    process.exit(0);
  } else {
    console.log('[serverbid] attempting clean shutdown');
    server.close(() => {
      console.log('[serverbid] server shutdown complete');
      process.exit(0);
    });
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
