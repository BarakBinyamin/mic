const EventEmitter        = require('events')
const { createNeedle }    = require('./needle.js')
const { API }             = require('./api')
const { inherits } = require('util')
// player.js 
//   The core element in audio management
//   Abstract: This module is responsible for making the audioBuffer contain the right data at the right time.
//   Usage   : To stream audio, read from the player.audioBuffer on every player update event   
//
//  Notes about importing this module:
//    this module is ONE variable that many files may access
//    For convention the player object should be imported in one file, and passed into functions that require it

// CONSTANT GLOBALS
const UPDATERATE      = '* * * * * *'            // every Second
const NEEDLE          = createNeedle(UPDATERATE) // realiably emits events on UPDATERATE
const EVENTEMITTER    = new EventEmitter()
const DEFAULT_TRACK_ID= "whitenoise"
const WORKING_DIR     = "./player/nowplaying"    // runtime directory where all currently playing tracks go
const MAIN_TRACK      = { trackid: "main", songid: "whitenoise", position: 0, location: `${WORKING_DIR}/nowplaying.mp3`}
const SAMPLESPERSECOND= 15000                    // don't change this, mp3 settings
const SAMPLESPERPACKET= SAMPLESPERSECOND
// VARIABLE GLOBALS
let AUDIOBUFFER  = []                            // one seconds worth of data updated every second
let QUEUE        = []
let SETTINGS     = {
    fadein : 0, // in seconds
    fadeout: 0, // in seconds
}
let TRACKS       = [MAIN_TRACK]                  // tracks to mix into the audioBuffer

const api = new API(QUEUE, SETTINGS, TRACKS, EVENTEMITTER, WORKING_DIR, DEFAULT_TRACK_ID, SAMPLESPERPACKET)

async function init(){
    api.updateTracks()
}
init()

async function updateBuffer(){
    AUDIOBUFFER = await api.getOneSecond()
    EVENTEMITTER.emit("update")
}

NEEDLE.on("update", updateBuffer)

const player = {
    getAudioBuffer : () => { return AUDIOBUFFER },
    eventEmitter   : EVENTEMITTER,
    api: {
        // TODO
    }
}

module.exports = player