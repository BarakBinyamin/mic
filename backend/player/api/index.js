const fs              = require('fs')
const { getOneSecond }= require('../../multimedia/getOneSecond.js')
const { setNowPlaying}=require('../../multimedia/setNowPlaying.js')
const newSongEvent    = "newSong"

class API {
    constructor(QUEUE, SETTINGS, TRACKS, EVENTEMIITER, WORKINGDIRECTORY, DEFAULT_TRACK_ID, SAMPLESPERPACKET){
        this.QUEUE        = QUEUE                // List of type <Song> for what to play next, starting with what is now playng
        this.TRACKS       = TRACKS               // metadata about currently playing tracks
        this.SETTINGS     = SETTINGS             // fadein fadeout settings
        this.EVENTEMIITER = EVENTEMIITER         // Used to Emit an event when a song ends and a new song begins
        this.WORKINGDIRECTORY = WORKINGDIRECTORY // Directory to place playing mixed audio into
        this.DEFAULT_TRACK_ID = DEFAULT_TRACK_ID // Fallback track when nothing is playing, there must always be something playing 
        this.SAMPLESPERPACKET = SAMPLESPERPACKET // (# of samples in mp3 != # of bytes) due to encoding, but it's about ==
        this.ISUPDATEING      = false
    }

    // HELPER FUNCTONS
    async trackHasDataLeft(track){
        try{
            const PACKET_SIZE = this.SAMPLESPERPACKET
            const PACKET_NUM  = track.position
            const stats       = fs.statSync(track.location)
            const filesize    = stats.size
            const bytesread   = (PACKET_SIZE*PACKET_NUM)
            const bytesleft   = filesize-bytesread
            if (bytesleft > 0){
                return true
            }else{
                return false
            }
        }catch(err){
            //console.log(err)
            return false
        }
    }

    // BEGIN INTERNAL API
    async updateTracks(){
        let tracksToRemove = []
        for (let i = 0; i<this.TRACKS.length; i++){
            const track = this.TRACKS[i]
            const trackStillHasDataLeft = await this.trackHasDataLeft(track)
            if (!trackStillHasDataLeft){
                const trackid = track.trackid
                if (trackid==="main"){
                    await this.loadNextTrack()
                }else{
                    tracksToRemove.push(trackid)
                }
            }
            else{
                track.position++
            }
        }

        for (let i=0; i<tracksToRemove.length; i++){
            const trackid = tracksToRemove[i]
            this.TRACKS.filter(track=>track.trackid!=trackid)
        }
    }

    async getNextSong(){
        const nextSongId = this.QUEUE[0]?.id
        const nextSong   = nextSongId ? nextSongId : this.DEFAULT_TRACK_ID
        return nextSong
    }

    async loadNextTrack(){
        console.log("Loading next track...")
        try{
            if (!this.ISUPDATING){
                this.ISUPDATING = true
                const nowplaying    = this.TRACKS.find(track => track.trackid == "main")
                nowplaying.position = 0
                this.QUEUE.shift(1)    // remove from stack
                const nextSong      = await this.getNextSong()
                nowplaying.songid   = nextSong
                await setNowPlaying(nextSong,this.SETTINGS)   // ffmpeg the mp3 into the nowplayling.mp3
                this.EVENTEMIITER.emit(newSongEvent)          // new song event so that new song event can be sent to host with data
                this.ISUPDATING = false
            }else{
                await new Promise((resolve, reject) => setTimeout(resolve, 500))
                return true 
            }
        }catch(err){
            console.log(err)
            this.ISUPDATING = false
        }
    }

    async getOneSecond(){
        const  aduioBuffer = await getOneSecond(this.TRACKS)
        this.updateTracks()
        return aduioBuffer
    }

    // BEGIN PLAYER API
    // #GET  QUEUE             #4
    async getQueue(){
        return this.QUEUE
    }
    // #SKIP SONG PLAYING NOW  #5
    async skip(){
        this.loadNextTrack()
    }
    // #GET  SONG mp3/wav/m4a
    // #GET  SONG INFO       
    // #GET  NOW PLAYING  
    async getnowplayingid(){
        const  nowplayingid = this.TRACKS[0].songid
        return nowplayingid
    }
    // #ADD  SONG TO LIBRARY   #1
    // #ADD  SONG TO QUEUE     #3
    // #PLAY SONG NOW          #2
    async playnow(song){
        if (this.QUEUE.length==0){
            this.QUEUE.push(song) // we have to do this twice because whitenoise is not listed in the queue
            this.QUEUE.push(song) // a song does not leave the queue unti it is done playing
        }else{
            this.QUEUE.splice(1, 0, song) // insert song into queue as next track
        }
        await this.skip()
    }

    // #SET FADE IN FADE OUT  

    // #ADD TRACK
    
    // #ADD PLAYILIST TO QUEUE
    // #REMOVE PLAYLIST TO QUEUE
}

module.exports = API