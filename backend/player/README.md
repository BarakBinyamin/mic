# Player
An abstract record player that uses ffmpeg under the hood to mix and overlay audio

```javascript
// The player is a javscript object with three keys
const player = {
    getAudioBuffer : () => { return AUDIOBUFFER },
    eventEmitter   : EVENTEMITTER,
    api: api
}
```

## Usage
Listen to the the player
``` javascript
// Assign the player to a variable
const player  = require('/relative/path/to/player')
// Make an update handler
const updateHandler = () =>{ const audioBuffer = player.getAudioBuffer(); /* do something with the buffer */ }
// Listen to updates
player.eventEmitter.on("update", updateHandler)
```
Player Controls
```javascript
// All controls are async functions
player.api.getQueue().then(queue => console.log(queue)) // returns list of type <Song>
player.api.skip()                                       // skip the current playing song
player.api.getnowplayingid()                            // return just the id of the current playing song
player.api.playnow(song)                                // Accepts type <Song>, replaces the current playing song
```

## Directory
| Name                        | Purpose                                           | 
| :--                         | :--                                               |
|[api](api)                   | Record Player Controls                            |
|[nowplaying](nowplaying)     | Where live media is stored                        |
|[needle.js](needle.js)       | Abstract needle, emits event reliably every second|

## TODO
current model
queue = [ nowplaying, queued1, queued2, queued3]
onEnd or skip -> queue.shift(1), load song into NowPlaying.mp3

- update queue now playing data model to make more sense
    - allow access to now playing
    - play now functionality

### track
```javascript
{
    positon : 0,                  // in seconds
    location: "path/to/file.mp3", // location in working directory
    trackid : "main"              // optioanl, used to manage tracks
    songid  : "whitenoise"        // id of song to find in library
}
```
### understanding mp3
https://www.audiomountain.com/tech/audio-file-size.html
