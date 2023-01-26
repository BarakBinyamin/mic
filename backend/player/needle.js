const EventEmitter = require('events')
const schedule     = require('node-schedule')
const eventEmitter = new EventEmitter()

// UPDATE_TIME='* * * * * *' creates a schedule to make an update event on every second
function createNeedle(UPDATE_TIME){
    schedule.scheduleJob(UPDATE_TIME, function(){
        eventEmitter.emit("update")
    })
    return eventEmitter
}

module.exports.createNeedle = createNeedle

