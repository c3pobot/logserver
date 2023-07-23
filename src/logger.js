/*
Logger class for easy and aesthetically pleasing console logging
*/
const chalk = require('chalk');
const Level = {};
Level.ERROR = 'error';
Level.WARN = 'warn';
Level.INFO = 'info';
Level.DEBUG = 'debug';

const LevelMap = {};
LevelMap[Level.ERROR] = 4;
LevelMap[Level.WARN] = 3;
LevelMap[Level.INFO] = 2;
LevelMap[Level.DEBUG] = 1;

let logLevel;
function getTimeStamp(timestamp){
  if(!timestamp) timestamp = Date.now()
  let dateTime = new Date(timestamp)
  return dateTime.toLocaleString('en-US', { timeZone: 'Etc/GMT+5', hour12: false })
}
function getContent(msg){
  try{
    if (typeof msg === 'string' || msg instanceof String) return msg
    if(msg?.stack){
      if(logLevel > 1) return msg
      let content = ''
      let stack = msg.stack?.split('\n')
      for(let i = 0;i<3;i++) content += stack[i]+'\n'
      return content
    }else{
      return JSON.stringify(msg)
    }
  }catch(e){
    return msg
  }
}
function setLevel(level = Level.DEBUG) {
  if (LevelMap.hasOwnProperty(level)) {
    logLevel = LevelMap[level];
  } else {
    logLevel = LevelMap[Level.INFO];
  }
}
setLevel(Level.DEBUG);

module.exports.Level = Level;

function log(type, message, timestamp) {
  if (logLevel <= LevelMap[type]) {
    if(!timestamp) timestamp = Date.now()
    let content = getContent(message)
    switch (type) {
      case Level.ERROR: {
        return console.error(`${getTimeStamp(timestamp)} ${chalk.bgRed(type.toUpperCase())} ${content}`);
      }
      case Level.WARN: {
        return console.warn(`${getTimeStamp(timestamp)} ${chalk.black.bgYellow(type.toUpperCase())} ${content}`);
      }
      case Level.INFO: {
        return console.log(`${getTimeStamp(timestamp)} ${chalk.bgBlue(type.toUpperCase())} ${content}`);
      }
      case Level.DEBUG: {
        return console.log(`${getTimeStamp(timestamp)} ${chalk.green(type.toUpperCase())} ${content}`);
      }
      default: throw new TypeError('Logger type must be either error, warn, info/log, or debug.');
    }
  }
};

module.exports.setLevel = setLevel;
module.exports.error = (content, timestamp) => log(Level.ERROR, content, timestamp);
module.exports.warn = (content, timestamp) => log(Level.WARN, content, timestamp);
module.exports.info = (content, timestamp) => log(Level.INFO, content, timestamp);
module.exports.log = (content, timestamp) => log(Level.INFO, content, timestamp);
module.exports.debug = (content, timestamp) => log(Level.DEBUG, content, timestamp);
