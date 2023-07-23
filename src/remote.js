'use strict'
const path = require('path')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file');
const DATA_DIR = process.env.DATA_DIR || path.join(baseDir, 'data')

const logger = winston.createLogger({
  transports: [new DailyRotateFile({
    filename: path.join(DATA_DIR, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '20m',
    maxFiles: '14d'
  })]
})

module.exports = logger
