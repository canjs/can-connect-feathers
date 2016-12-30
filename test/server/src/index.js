'use strict';

// Remove data folder before the server starts so we have fresh data.
const rm = require('rimraf');
rm.sync('./test/server/data');

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

server.on('listening', () =>
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
);

if (process.argv.indexOf('--timeout') >= 0) {
  setTimeout(function () {
    server.close();
    process.exit(0);
  }, 15000);
}
