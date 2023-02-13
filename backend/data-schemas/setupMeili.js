const { MeiliSearch } = require('meilisearch')
const { Song        } = require('./song.js')
const fs              = require('fs')
let parseFile = ""; import('music-metadata').then(mod => parseFile = mod.parseFile)

LIBRARY    = "../library"
WHITENOISE = "whitenoise"

async function main(DATABASEHOST){
    const client = new MeiliSearch({
        host: DATABASEHOST,
    })
    
    // await client.deleteIndex("songs") // for testing clear db
    await client.createIndex("songs")
    await client.index('songs').updateFilterableAttributes([
        'title',
        'album',
        'artist',
        'releasedate',
        'status'
      ])
    const database = client.index("songs")
    const defaultSong  = new Song()
    defaultSong.id     = "whitenoise"
    defaultSong.title  = "Nothing"
    defaultSong.artist = "Nobody"
    database.updateDocuments([defaultSong])   
    
    // Update database with songs that exist on host machine
    //scanLibraryAndUpdateDatabase()
}

async function scanLibraryAndUpdateDatabase(){
    let files = fs.readdirSync(LIBRARY, {root : '.'})
    files     =  files.filter(filename => filename.includes(".m4a") && !filename.includes(WHITENOISE))
    for (let i=0; i<files.length; i++){
        let filepath = `${LIBRARY}/${files[i]}`
        let metadata = await parseFile(filepath)
        let tags = metadata?.common
        if (tags?.title){
            if (tags?.artist){
                console.log(`${i}. ${tags.title} by ${tags.artist}`)
            }else{
                console.log(`${i}. ${tags.title}`)
            }
        }
    }
    //let metadata = await parseFile(filepath)
    // tags = metadata.common
    // tags.title
    // tags.artist
    // tags.lyrics
    // tags.album
    //
    // id
    // imagepath
    // isloading   = false  // all clear to use 
    // status      = true   // all clear to use
}

module.exports.setupMeili = main
