const axios = require('axios')

const baseurl = "http://localhost:3000"

const updateHandler = async (player, socket) => {
    try{
        const songid     = await player.api.getnowplayingid()
        const request    = await axios.get(`${baseurl}/api/songinfo?id=${songid}`)
        const nowplaying = request.data
        const metadata  =  {}
        metadata.artsrc = `/api/img?id=${nowplaying.id}`
        metadata.artist = `${nowplaying.artist}`
        metadata.title  = `${nowplaying.title}`
        metadata.album  = `${nowplaying.album}`
        socket.emit("update", metadata)
    }catch(err){
        console.log(new Error("Something happended"))
        console.log(err)
    }
}

function createMetaEmitter(player, io){
    io.on('connection', (socket) => {   
        updateHandler(player,socket)

        const hanlderId = () => {updateHandler(player,socket)}
        player.eventEmitter.on("newSong", hanlderId)

        socket.on('end', ()=>{
            eventEmitter.removeListener("newSong",hanlderId)
        })
        
    })
}

module.exports.createMetaEmitter = createMetaEmitter