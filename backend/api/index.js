const express     = require('express')
const router      = express.Router()
// const fs          = require('fs')

const player  = require('../player')
const library = require('./library')

// Main Streaming Route
router.get("/nowPlaying", async (req,res)=>{
    res.writeHead(200,"OK",{"Content-Type":"audio/mpeg"})

    const updateHandler = () =>{ const audioBuffer = player.getAudioBuffer(); res.write(audioBuffer);}
    player.eventEmitter.on("update", updateHandler) // On update event, then send another packet

    req.socket.on("close",()=>{
        player.eventEmitter.removeListener("update",updateHandler)
        console.log(`Client ${req.socket.remoteAddress || ""} disconected from server`)
    })
})

router.get('/play', async (req,res)=>{
    const songRequest = req.query.song
    const results     = await library.searchLibrary(songRequest)
    const song        = results?.hits[0]
    if (song){
        await player.api.playnow(song)
    }
    const msg         = song ? `You got it! Now playing ${song.title} by ${song.artist}` : "Na, we couldn't find that song"
    res.send(msg)
})
// router.get('/queue', async (req,res)=>{
//     const songRequest = req.query.song
//     const status      = await library.addtoqueue(this.nowPlaying,this.needle,this.settings,songRequest)
//     const msg         = status ? `You got it! Added ${status.title} by ${status.artist} to queue` : "Na, we couldn't find that song"
//     res.send(msg)
// })
router.get('/queuelist', async (req,res)=>{
    const    queue      = await player.api.getQueue()
    res.send(queue)
})
router.get('/skip', async (req,res)=>{
    const status        = await player.api.skip()
    res.send("SKIP")
})
router.get('/add', (req,res)=>{
    library.addLucky(req.query.song,res)
})

// Get Resources
router.get("/img", async (req,res)=>{
    const id     = req.query.id
    const path   = `../library/${id}.jpg`
    const exists = fs.existsSync(path,{root:'.'})
    if (exists){
        res.sendFile(`/usr/src/library/${id}.jpg`)
    }else{
        res.status(404).send("Not Found")
    }
})
router.get("/search", async (req,res)=>{
    const songRequest = req.query.song
    const results     = await library.searchLibrary(songRequest)
    res.send(results)
})


module.exports = router
