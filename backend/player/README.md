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
