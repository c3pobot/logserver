'use strict'
const path = require('path')
let LOG_PATH = process.env.LOG_PATH || path.join(baseDir, 'data')
const winston = require('winston')
require('winston-daily-rotate-file');
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(LOG_PATH, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});
const log = winston.createLogger({
  format: format.combine(
    winston.format.json(),
    winston.format.colorize()
  ),
  timestamp: false,
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    fileRotateTransport,
    new winston.transports.Console()
  ]
})
