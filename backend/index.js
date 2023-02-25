const { program } = require('commander');
const express     = require('express')
const cors        = require('cors')

program
  .description('Serves both the frontend and backend services')
  .requiredOption('-p, --port <port>','The port to serve from');
program.parse();
const options = program.opts()
const PORT    = options.port

const { setupMeili   }= require('./data-schemas/setupMeili.js')
const inDocker        = require('./data-schemas/inDocker.js')

const DATABASEHOST    = inDocker ? 'http://meili:7700' : 'http://localhost:7700' 
const setup           = setupMeili(DATABASEHOST)
const api             = require('./api')
const WEBAPP          = '../view/dist'

const jsonTools   = express.json()
const app         = express()

app.use(cors())
app.use(jsonTools)
app.use('/api', api)
app.use('/', express.static(WEBAPP))

// app.listen(PORT, () => {
//     console.log(`Serving MIC listening on http://localhost:${PORT}`);
// })

/* Setup websockets for new song updates */
const { createMetaEmitter } = require('./multimedia/metaEmitter.js')
const http                  = require('http')
const server                = http.createServer(app)
const { Server }            = require("socket.io")
const io                    = new Server(server)
const player                = require("./player")
const baseurl               = `http://localhost:${PORT}`

createMetaEmitter(player, io, baseurl)
/* End Setup websockets */

server.listen(PORT, () => {
  console.log(`Serving MIC on http://localhost:${PORT}`);
})