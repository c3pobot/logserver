'use strict'
const local = require('./local')
const remote = require('./remote')
const PORT = process.env.PORT || 3000
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express()
app.use(bodyParser.json({
  limit: '100MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression())

app.get('/healthz', (req, res)=>{
  res.status(200).json({res: 'ok'})
})
app.post('/saveLogs', (req, res)=>{
  handleSaveLogRequest(req, res)
})
const server = app.listen(PORT, ()=>{
  local.info('log server is listening on '+server.address().port)
  remote.info('log server is listening on '+server.address().port)
})
function log2console(data = {}){
  let msg = ''
  if(data.set && data.pod){
    msg = `${data.set}-${data.pod} : ${data.message}`
  }else{
    msg = data.message
  }
  local.log({level: data.level, timestamp: data.timestamp, message: msg})
}
function handleSaveLogRequest(req, res){
  let level = req.body.level, data = req.body
  if(level && data){
    log2console(data)
    remote.log(data)
  }
  res.sendStatus(200)
}
