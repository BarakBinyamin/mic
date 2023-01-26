const { spawnSync } = require('child_process')

const LIBRARY = '../library'

async function copyToWavAndMp3(id){
    const song    = `${LIBRARY}/${id}.m4a`
    const output  = spawnSync('ffmpeg',['-i',`${song}`,'-ar','32000','-ac','1','-acodec','pcm_u8',`${LIBRARY}/${id}.wav`])
    const output2 = spawnSync('ffmpeg',['-i',`${LIBRARY}/${id}.wav`,'-ab', '128k',`${LIBRARY}/${id}.mp3`])
}

module.exports.copyToWavAndMp3 = copyToWavAndMp3

// for testing
// const { copyToWavAndMp3 } = require('./multimedia/convert.js')
// copyToWavAndMp3("whitenoise")