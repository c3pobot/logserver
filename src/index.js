'use strict'
const winstond = require('winstond');
const path = require('path')
let LOG_PATH = process.env.LOG_PATH || path.join(baseDir, 'data')
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(LOG_PATH, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});
let nssocket = winstond.nssocket.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9000
});

nssocket.add(winstond.transports.Console);

nssocket.add(fileRotateTransport);

let http = winstond.http.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9001
});

http.add(winstond.transports.Console, {});
http.add(fileRotateTransport);

nssocket.listen();
http.listen();
