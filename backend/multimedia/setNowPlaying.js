const { spawnSync } = require('child_process')

const LIBRARY    = '../library'
const NOWPLAYING = './player/nowplaying'

async function setNowPlaying(id, settings){
    console.log(`Setting now playing to ${id}...`)
    const song    = `${LIBRARY}/${id}.mp3`
    const stats   = spawnSync('ffmpeg', ['-i',`${song}`,'2>&1'])
    const duration= stats.output[2].toString().match(/Duration[^,]*,/)[0].match(/:[0-9]*:[0-9]*/)[0].replace(':','') // sometimes error is here
    const seconds = duration.split(':').reduce((acc,time) => (60 * acc) + +time)
    const fadeInDuration  = 5
    const fadeOutDuration = 5
    const startFadeOut    = seconds-fadeOutDuration
    const output = spawnSync('ffmpeg',[
        '-y', '-i',`${song}`,'-vf',
        `afade=t=in:st=0:d=${fadeInDuration},afade=t=out:st=${startFadeOut}:d=${fadeOutDuration}`,
        '-map', '0:a', '-c:a', 'copy', '-map_metadata', '-1',
        `${NOWPLAYING}/nowplaying.mp3`
    ])
    //console.log(output.stderr.toString())
}

module.exports.setNowPlaying = setNowPlaying

