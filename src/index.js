'use strict'
const log = require('./logger')
const mongo = require('mongoapiclient')

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
app.post('/fluentBit', (req, res)=>{
  handleFluentBit(req?.body)
  res.sendStatus(200)
})
const server = app.listen(PORT, ()=>{
  log.info('log server is listening on '+server.address().port)
})
function correctMsg(data = {}){
  try{
    if(data.date) data.date = data.date * 1000
    let msg = data.log, array = data.log.split(data.logLevel?.toUpperCase())
    if(array?.length > 1) msg = array[1].trim()
    data.log = msg
  }catch(e){
    log.error(e)
  }
}
function save2mongo(data={}){
  try{
    mongo.insert('logs', data)
  }catch(e){
    log.error(e)
  }
}
function handleFluentBit(data = []){
  try{
    for(let i in data){
      let logLevel = 'info'
      if(data[i].logLevel) logLevel = data[i].logLevel
      correctMsg(data[i])
      save2mongo(data[i])
      log[logLevel](`${data[i].pod_name} : ${data[i].container_name} :\n  ${data[i].log}`, data[i].date)
    }
  }catch(e){
    log.error(e)
  }
}
