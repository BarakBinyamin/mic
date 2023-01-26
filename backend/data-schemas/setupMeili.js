const { MeiliSearch } = require('meilisearch')
const { Song        } = require('./song.js')

async function main(){
    const client = new MeiliSearch({
        host: 'http://localhost:7700',
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
}

module.exports.setupMeili = main