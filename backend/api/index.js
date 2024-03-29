const express     = require('express')
const router      = express.Router()
const fs          = require('fs')

const player  = require('../player')
const library = require('./library')

router.use(express.json()) // add json support to router

const IMGBASEPATH = __dirname.split('/backend')[0]

// Main Streaming Route
router.get("/nowPlaying", async (req,res)=>{
    res.writeHead(200,"OK",{"Content-Type":"audio/mpeg"})

    const updateHandler = () =>{ const audioBuffer = player.getAudioBuffer(); res.write(audioBuffer);}
    player.on(player.events.update, updateHandler) // On update event, then send another packet

    req.socket.on("close",()=>{
        player.removeListener(player.events.update,updateHandler)
        console.log(`Client ${req.socket.remoteAddress || ""} disconected from server`)
    })
})

router.get('/play', async (req,res)=>{
    const songRequest = req.query.song
    const results     = await library.searchLibrary(songRequest)
    const song        = results?.hits[0]
    let   response    = ""
    if (song){
        if (song?.status){
            await player.api.playnow(song)
            response =  `You got it! Now playing ${song.title} by ${song.artist}`
        }else{
            response = `${song.title} by ${song.artist} exists in the library, but it appears to have some missing data, so we can't play it` 
        }
    }else{
        response = "Na, we couldn't find that song"
    }
    res.send(response)
})
router.get('/queue', async (req,res)=>{
    const songRequest = req.query.song
    const results     = await library.searchLibrary(songRequest)
    const song        = results?.hits[0]
    let   response    = ""
    if (song){
        if (song?.status){
            await player.api.enque(song)
            response =  `You got it! Added ${song.title} by ${song.artist} to the queue`
        }else{
            response = `${song.title} by ${song.artist} exists in the library, but it appears to have some missing data, so we can't play it` 
        }
    }else{
        response = "Na, we couldn't find that song"
    }
    res.send(response)
})
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
        res.sendFile(`${IMGBASEPATH}/library/${id}.jpg`)
    }else{
        res.status(404).send("Not Found")
    }
})
router.get("/search", async (req,res)=>{
    const songRequest = req.query.song
    const results     = await library.searchLibrary(songRequest)
    res.send(results)
})
router.get("/songinfo", async (req,res)=>{
    const songId      = req.query.id
    const results     = await library.getSongInfo(songId)
    res.send(results)
})
router.get("*", async (req,res)=>{
    res.send("The api is up and running, but this route does not exist")
})

module.exports = router
