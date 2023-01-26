const { MeiliSearch } = require('meilisearch')

const client = new MeiliSearch({
    host: 'http://meili:7700',
  })
const database = client.index("songs")

async function getSongInfo(id){
    const   songInfo = database.getDocument(id)
    return  songInfo
}

const updateHandler = async (socket) => {
    try{
        const nowplaying = "" // get now playing
        const info       = await getSongInfo(nowplaying?.id)
        const metadata  =  {}
        metadata.artsrc = `/api/img?id=${nowplaying.id}`
        metadata.artist = `${info.artist}`
        metadata.title  = `${info.title}`
        metadata.album  = `${info.album}`
        socket.emit("update", metadata)
    }catch{
        console.log(new Error("Something happended"))
        console.log(nowplaying)
    }
}

function createMetaEmitter(eventEmitter, io){
    io.on('connection', (socket) => {   
        updateHandler(socket)

        const hanlderId = () => {updateHandler(socket)}
        eventEmitter.on("newSong", hanlderId)

        socket.on('end', ()=>{
            eventEmitter.removeListener("newSong",hanlderId)
        })
        
    })
}

module.exports.createMetaEmitter = createMetaEmitter