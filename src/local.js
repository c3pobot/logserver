'use strict'
const winston = require('winston')
function getTimeStamp(timestamp){
  if(!timestamp) return
  let dateTime = new Date(timestamp)
  return dateTime.toLocaleString('en-US', { timeZone: 'Etc/GMT+5', hour12: false })
}
function getMessage(info = {}){
  let timestamp = info.timestamp
  if(!timestamp) timestamp = Date.now()
  return `${getTimeStamp(timestamp)} ${info.level} : ${info.message}`
}
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({all: true }),
    winston.format.printf(info => getMessage(info))
  ),
  transports: [new winston.transports.Console()]
})

module.exports = logger
