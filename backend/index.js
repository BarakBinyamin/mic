const env         = require('dotenv').config()
const express     = require('express')
const cors        = require('cors')
const fs          = require('fs')

const { setupMeili   }= require('./data-schemas/setupMeili.js')
const inDocker        = require('./data-schemas/inDocker.js')

const DATABASEHOST    = inDocker ? 'http://meili:7700' : 'http://localhost:7700' 
const setup           = setupMeili(DATABASEHOST)
const api             = require('./api')
const WEBAPP          = '../view/dist'
const UPDATERATE      = '* * * * * *'                    // every second

const jsonTools   = express.json()
const app         = express()

const PORT        = process.env.PORT

app.use(cors())
app.use(jsonTools)
app.use('/api', api)
app.use('/', express.static(WEBAPP))

// app.listen(PORT, () => {
//     console.log('Pebblez Radio listening on http://localhost:3000');
// })

/* Setup websockets for new song updates */
const { createMetaEmitter } = require('./multimedia/metaEmitter.js')
const http                  = require('http')
const server                = http.createServer(app)
const { Server }            = require("socket.io")
const io                    = new Server(server)
const player                = require("./player")

createMetaEmitter(player.eventEmitter, io)
/* End Setup websockets */

server.listen(PORT, () => {
  console.log('Pebblez Radio listening on http://localhost:3000');
})