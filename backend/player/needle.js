const EventEmitter     = require('events')
const schedule         = require('node-schedule')
const eventEmitter     = new EventEmitter()
eventEmitter['events'] = {
    'update': 'update'
}

// UPDATE_TIME='* * * * * *' creates a schedule to make an update event on every second
function createNeedle(UPDATE_TIME){
    schedule.scheduleJob(UPDATE_TIME, function(){
        eventEmitter.emit(eventEmitter.events.update)
    })
    return eventEmitter
}

module.exports.createNeedle = createNeedle

