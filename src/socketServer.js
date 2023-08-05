'use strict'
const log = require('./logger')
const { Server } = require('socket.io')
let io, logLines = [], MAX_LINES = 2000
const StartServer = (server)=>{
  try{
    io = new Server(server, {maxHttpBufferSize: 1e8})
    log.info(`Log server socket server is listening on ${server.address().port}`)
    io.on('connection', (socket)=>{
      socket.join('logStream')
      socket.on('disconnect', (reason)=>{
        log.info(`${socket.id} disconnected because of ${reason}`)
      })
      socket.on('connect', ()=>{
        log.info(`${socket.id} connected`)
      })
    })
  }catch(e){
    log.error(e)
  }
}
const checkLogLines = ()=>{
  try{
    if(logLines.length > MAX_LINES){
      while(logLines.length > (MAX_LINES - 20)) logLines.pop()
    }
    setTimeout(checkLogLines, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkLogLines, 5000)
  }
}
checkLogLines()
module.exports = StartServer
module.exports.sendLog = (data={})=>{
  try{
    logLines.unshift(data)
    if(io) io.to('logStream').emit('logs', logLines)
  }catch(e){
    log.error(e)
  }
}
