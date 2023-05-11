const { spawnSync } = require('child_process')

const LIBRARYBASEPATH = __dirname.split('/backend')[0]
const LIBRARY         = `${LIBRARYBASEPATH}/library`
const NOWPLAYING      = './player/nowplaying'

async function setNowPlaying(id, settings){
    console.log(`Setting now playing to ${id}...`)
    const song    = `${LIBRARY}/${id}.mp3`
    const stats   = spawnSync('ffmpeg', ['-i',`${song}`])
    const duration= stats.output[2].toString().match(/Duration[^,]*,/
        )[0].match(/:[0-9]*:[0-9]*/)[0].replace(':','')
    const lengthInSeconds = duration.split(':').reduce((acc,time) => (60 * acc) + +time)
    const fadeInDuration  = 5
    const fadeOutDuration = 5
    const startFadeOut    = lengthInSeconds-fadeOutDuration
    // TODO: make this nowplaying.mp3 to be consistant sampling rate, 
    // now it just copies a song from the library into nowplaying.mp3 
    // with fade settings
    const output = spawnSync('ffmpeg',[
        '-y', '-i',`${song}`,'-vf',
        `afade=t=in:st=0:d=${fadeInDuration},afade=t=out:st=${startFadeOut}:d=${fadeOutDuration}`,
        '-map', '0:a', '-c:a', 'copy', '-map_metadata', '-1',
        `${NOWPLAYING}/nowplaying.mp3`
    ])
    //console.log(output.stderr.toString())
}

module.exports.setNowPlaying = setNowPlaying

