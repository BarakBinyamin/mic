const { MeiliSearch } = require('meilisearch')
const { genius      } = require('../../scrapers/genius')
const { youtubedl   } = require('../../scrapers/youtubedl')

const { Song        } = require('../../data-schemas/song.js')
const { v4: uuidv4  } = require('uuid')

const fs              = require('fs')

const { dlimg           } = require('../../multimedia/dlimg.js')
const { writeTags       } = require('../../multimedia/meta.js')
const { copyToWavAndMp3 } = require('../../multimedia/convert.js')

const inDocker        = require('../../data-schemas/inDocker.js')
const databasehost    = inDocker ? 'http://meili:7700' : 'http://localhost:7700' 
const client          = new MeiliSearch({ host: databasehost })
const database        = client.index("songs")
const LIBRARY         = '../library'

const QUEUE      = []
let   ISUPDATING = false

class library{
    // async getLastSongInQueueFromFirst(first_id){
    //     const song = await database.getDocument(first_id)
    //     const next = song?.upnext
    //     console.log(next,song.id)
    //     if (next && next!=song.id){
    //         const  lastSong = await CONTROLS.getLastSongInQueueFromFirst(next)
    //         return lastSong
    //     }else{
    //         return song
    //     }
    // }
    /*
    async addtoqueue(nowplaying, needle, settings, songname){
        console.log(`Got request to add ${songname} to the queue...`)
        const songs  = await database.search(songname)
        const song   = songs?.hits?.[0]
        if (song){
            if (QUEUE.length<1){   
                CONTROLS.playnow(nowplaying, needle, settings, songname)
            }
            QUEUE.push(song)
            return song
        }else{
            return false
        }          
    }
    async getQueue(){
        return QUEUE
    }
    //removefromqueue(id)
    //async playnextinqueue()
    async playnow(nowplaying, needle, settings, songname){
        const songs  = await database.search(songname)
        const song   = songs?.hits?.[0]
        const path   = `../library/${song?.id}.mp3`
        const exists = fs.existsSync(path,{root:'.'})

        if (song?.id && song?.status && exists){
            await setNowPlaying(song.id,settings) // ffmpeg the mp3 into the nowplayling.mp3
            nowplaying.id       = song.id
            nowplaying.position = 0
            needle.emit("newSong")
            return song
        }else{
            return false
        }
    }

    getnowplaying(nowplaying){
        return nowplaying
    }
    async getNextSong(){
        const nextSongId = QUEUE[0]?.id
        const nextSong   = nextSongId ? nextSongId : "whitenoise"
        return nextSong
    }
    async getSongInfo(id){
        const   songInfo = database.getDocument(id)
        return  songInfo
    }
    async loadNextSongInQueue(nowplaying,needle,settings){
        try{
            if (!ISUPDATING){
                ISUPDATING = true
                QUEUE.shift(1)     // remove from stack
                const nextSong     = await CONTROLS.getNextSong()
                await setNowPlaying(nextSong,settings)   // ffmpeg the mp3 into the nowplayling.mp3
                nowplaying.id       = nextSong
                nowplaying.position = 0
                needle.emit("newSong")                   // new song event so that new song event can be sent to host with data
                ISUPDATING = false
            }else{
                await new Promise((resolve, reject) => setTimeout(resolve, 500))
                return true 
            }
        }catch(err){
            ISUPDATING = false
            console.log(err)
        }
    }
    
*/
/* RADIO SETTINGS */
// setfade

/* SONGS */
    async searchGeninus(stringToSearch){
        return await genius(stringToSearch)
    }
    // async searchYoutube(stringToSearch){

    // }
    async searchLibrary(searchString){
        const  results = await database.search(searchString)
        return results
    }
    async getSongInfo(id){
        const  songInfo = database.getDocument(id)
        return songInfo
    }
    // async add(song){

    // }
    async remove(id){
        database.deleteDocument(id)
    }

/* AUTO ADD */
    async addLucky(stringToSearch,res){
        try{
            const data     =  await this.searchGeninus(stringToSearch)            // search genius
            if (data.type != "song"){console.log("addLucky: Couldn't find genius data");res.send("Sorry, we couldn't find that song on genius.com"); return false}
            const song = new Song()
                song.id          = uuidv4()
                song.title       = data.info.title
                song.album       = data.info.album
                song.artist      = data.info.artist
                song.lyrics      = data.info.lyrics
                song.releasedate = data.info.releaseDate
                song.artwork     = data.info.artwork
                song.youtube     = data.info.youtubelink
                song.spotify     = data.info.spotifyUuid
            if (!song.youtube){return false}
            
            const searchResults = await this.searchLibrary(data.info.title) // if song already exists exit
            for (let i=0; i<searchResults.hits.length; i++){
                const hit = searchResults.hits[i]
                if (song.title === hit.title && song.artist === hit.artist){
                    console.log("addLucky: Song with name and artist already exists")
                    res.send("That song is already added to the library")
                    return false
                }
            }
            res.send(`Adding ${song.title} by ${song.artist} to the library`)
            database.addDocuments([song])                          // add the song to the database
            await youtubedl(`${LIBRARY}/${song.id}`, song.youtube) // youtubedl the youtube song 
            await dlimg(data.info.artwork,song.id)                 // download and format the album art with ffmpeg
            await copyToWavAndMp3(song.id)                         // create wav and mp3's
            await writeTags(`${LIBRARY}/${song.id}.m4a`, song)     // add metatags to the song
            // if success            // update the song in the database
            song.isloading   = false // is fetching
            song.status      = true  // if isloading==false, this indicate if fetching was successful
            database.updateDocuments([song])
        }
        catch(error){
            console.log(error)
            return false
        }
    }
}

module.exports = new library()

// usage
// const { controls } = require('./api/functions/controls.js')
// controls.addLucky("hey ho lets go")

// fixing queue issues
// database.search(" ",{filter:'firstinqueue = true'}).then(res=>console.log(res))
// database.updateDocuments([{id:'1104491c-4f3d-4da6-a075-c5507977cd07',firstinqueue:false}])