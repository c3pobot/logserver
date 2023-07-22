'use strict'
const app = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const app = express()
const PORT = process.env.PORT || 3000
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
app.post('/logs', (req, res)=>{
  handleLogRequest(req, res)
})
