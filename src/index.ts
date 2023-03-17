import createDebug from 'debug';
import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';
const debug = createDebug('MH');

const PORT = process.env.PORT || 4250;

const server = http.createServer(app);
dbConnect()
  .then(() => {
    server.listen(PORT);
  })
  .catch((err) => console.log(err));

server.on('error', (error) => {
  debug(error.message);
});

server.on('listening', () => {
  debug('Listening in http://localhost: ' + PORT);
});
