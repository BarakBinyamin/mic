const express     = require('express')
const router      = express.Router()
// const fs          = require('fs')

const player  = require("../player")

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

module.exports = router
