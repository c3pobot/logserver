'use strict'
const path = require('path')
const DATA_DIR = process.env.DATA_DIR || path.join(baseDir, 'data')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file');
const fileLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
    format.json()
  )
})
const fileTransport = new DailyRotateFile({
  level: 'verbose',
  filename: path.join(DATA_DIR, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});
fileLogger.add(fileTransport)
const consoleLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
    format.json(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  )
})
const consoleTransport = new winston.transports.Console()
fileTransport.add(consoleTransport)
module.exports.remote = (type, data = {})=>{
  if(type){
    fileLogger[type](data)
    consoleLogger[type](JSON.stringify(data))
  }
}
module.exports.log = consoleLogger
