import math from 'mathjs'
import express from 'express'
import bodyParser from 'body-parser'
import Messenger from './Messenger'

// Constants

const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

if (VALIDATION_TOKEN == null) {
  console.error('VALIDATION_TOKEN not set')
  process.exit(1)
}

if (ACCESS_TOKEN == null) {
  console.error('ACCESS_TOKEN not set')
  process.exit(1)
}

// Setup

let messengerClient = new Messenger(ACCESS_TOKEN)
let app = express()
app.use(bodyParser.json())

// Routes

// Token validation
app.get('/messages-hook', function(req, res) {
  if (req.query['hub.verify_token'] !== VALIDATION_TOKEN) {
    res.status(403).send('Error, wrong validation token')
  }
  res.send(req.query['hub.challenge'])
})

// Message received
app.post('/messages-hook', function(req, res) {
  let message_events = req.body.entry[0].messaging
  for (let event of message_events) {
    let sender = event.sender.id
    if (event.message && event.message.text) {
      let text = event.message.text

      console.log(`Received [ ${text} ] from [ ${sender} ]`)

      let result = math.eval(text)
      messengerClient.send(sender, result, function(err) {
        if (err != null) {
          console.warn(`WARNING: Failed to send [ ${result} ] to [ ${sender} ]`)
          console.warn('WARNING: Send failed due to error', err)
        } else {
          console.log(`Sent [ ${result} ] to [ ${sender} ]`)
        }
      })
    }
  }
  res.status(200).end()
})

app.listen(process.env.PORT || 8080)
