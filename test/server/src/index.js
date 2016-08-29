'use strict';

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

server.on('listening', () =>
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
);

if (process.argv.indexOf('--timeout') >= 0) {
  setTimeout(function(){
    server.close();
    process.exit(0);
  }, 10000);
}
