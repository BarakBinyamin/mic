const EventEmitter        = require('events')
const { createNeedle }    = require('./needle.js')
const API                 = require('./api')
// player.js 
//   The core element in audio management
//   Abstract: This module is responsible for making the audioBuffer contain the right data at the right time
//   Usage   : To stream audio, read from the player.audioBuffer on every player update event   

// CONSTANT GLOBALS
const UPDATERATE      = '* * * * * *'            // every second
const NEEDLE          = createNeedle(UPDATERATE) // realiably emits events on UPDATERATE
const PLAYER          = new EventEmitter()
PLAYER['events']      = {
    'update'  : 'update',
    'newSong' :'newSong'
}
const DEFAULT_TRACK_ID= "whitenoise"
const WORKING_DIR     = "./player/nowplaying"    // runtime directory where all currently playing tracks go
const MAIN_TRACK      = { trackid: "main", songid: "whitenoise", position: 0, location: `${WORKING_DIR}/nowplaying.mp3`}
const SAMPLESPERSECOND= 15000                    // don't change this, it's about the number of mp3 samples in a second
const SAMPLESPERPACKET= SAMPLESPERSECOND
// VARIABLE GLOBALS
let AUDIOBUFFER  = []                            // one seconds worth of data, updated every second
let QUEUE        = []
let SETTINGS     = {
    fadein : 0, // in seconds
    fadeout: 0, // in seconds
}
let TRACKS       = [MAIN_TRACK]                  // tracks to mix into the audioBuffer

const api = new API(QUEUE, SETTINGS, TRACKS, PLAYER, WORKING_DIR, DEFAULT_TRACK_ID, SAMPLESPERPACKET)

async function init(){
    api.updateTracks()
}

async function updateBuffer(){
    AUDIOBUFFER = await api.getOneSecond()
    PLAYER.emit(PLAYER.events.update)
}

NEEDLE.on(NEEDLE.events.update, updateBuffer)

PLAYER['getAudioBuffer'] = () => { return AUDIOBUFFER }
PLAYER['api']            = api


init()

module.exports = PLAYER