const { spawnSync } = require('child_process')

const LIBRARY = '../library'

async function download(url,id){
    // output size tested for ios 15.6 and 16.4 html5 mediaSession api image
    const output = spawnSync('ffmpeg',['-i',`${url}`, '-vf', 'scale=512:512', `${LIBRARY}/${id}.jpg`])
}

module.exports.dlimg = download

// usage
// const url = "https://t2.genius.com/unsafe/600x600/https%3A%2F%2Fimages.genius.com%2Fde5a5c9bcc3119f37e49f8940b1602c3.1000x1000x1.jpg"
// const { dlimg } = require('./multimedia/dlimg.js')
// let foo; dlimg(url,'test.jpg')