const axios = require('axios')

const updateHandler = async (updateEvent, player, socket, baseurl) => {
    try{
        const songid     = await player.api.getnowplayingid()
        const nextsongid = await player.api.getnextplayingid()
        const request    = await axios.get(`${baseurl}/api/songinfo?id=${songid}`)
        const request2   = await axios.get(`${baseurl}/api/songinfo?id=${nextsongid}`)
        const nowplaying  = request.data
        const nextplaying = request2.data
        const metadata  =  {}
        metadata.artsrc = `/api/img?id=${nowplaying.id}`
        metadata.artist = `${nowplaying.artist}`
        metadata.title  = `${nowplaying.title}`
        metadata.album  = `${nowplaying.album}`
        metadata.nextArtsrc = `/api/img?id=${nextplaying.id}`
        metadata.nextArtist = `${nextplaying.artist}`
        metadata.nextTitle  = `${nextplaying.title}`
        metadata.nextAlbum  = `${nextplaying.album}`
        socket.emit(updateEvent, metadata)
    }catch(err){
        console.log(new Error('Error while sending metadata on player.events.newSong event'))
        console.log(err)
    }
}

function createMetaEmitter(player, io, baseurl){
    io.on('connection', (socket) => {   
        updateHandler(io.events.update,player,socket,baseurl)

        const hanlderId = (metaData) => {updateHandler(io.events.update,player,socket,baseurl)}
        player.on(player.events.newSong, hanlderId)

        socket.on('end', ()=>{
            player.removeListener(player.events.newSong,hanlderId)
        })
        
    })
}

module.exports.createMetaEmitter = createMetaEmitter