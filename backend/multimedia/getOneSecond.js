const { spawnSync } = require('child_process')
const fs = require('fs')

const MIXED_RESULT = './player/nowplaying/nowplayingMix.mp3'

async function getOneSecond(tracks){
    // use the nowplaying track as a base for the new mix 
    // then the 
    // if tracks[0].position == 0 -> copy nowplaying into MIXED_RESULT
    // if tracks.length>0         -> mix new tracks into  MIXED_RESULT using MAIN TRACK position as adelay
    // ffmpeg -i tracks[0].location -i 1.mp3 -filter_complex "[1:a]adelay=12s:all=1[a1];[0:a][a1]amix=inputs=2[out]" -map "[out]" nowplayingMix.mp3

    // return the now playing track at the current position
    const PACKET_NUM          = tracks[0].position  // MAIN track is always track 0
    const PACKET_SIZE         = 15000               // Assumed
    const STREAM_PATH         = tracks[0].location  // MIXED_RESULT TODO
    const file_descriptor     = fs.openSync(STREAM_PATH, 'r', null)
    const read_offset         = PACKET_NUM * PACKET_SIZE
    const buffer              = Buffer.alloc(PACKET_SIZE)
    const buffer_write_offset = 0
    const num_bytes_to_read   = PACKET_SIZE
    const num_bytes_read      = fs.readSync(file_descriptor, buffer, buffer_write_offset, num_bytes_to_read, read_offset)
    fs.closeSync(file_descriptor)
    return buffer
}

module.exports.getOneSecond = getOneSecond

/*
method 1: one second at a time
Failed due to new file fomatting

let time_and_file_parameters = []
    let mixing_inputs            = ""
    const numberOfTracks         = tracks.length
    for (let i=0; i<numberOfTracks;i++){
        const track      = tracks[i]
        const from       = track.position     // in seconds
        const to         = track.position + 1 // in seconds
        const location   = track.location
        const parameters = ["-ss", from, "-to", to, "-i", location]
        const mixing_var = `[${i}]`
        time_and_file_parameters.push(...parameters)
        mixing_inputs += mixing_var
    }
    const complex_filter_string = `${mixing_inputs}amix=inputs=${numberOfTracks}[out]`
    const mixingJob = spawnSync('ffmpeg',[
        '-y',...time_and_file_parameters,
        '-filter_complex', complex_filter_string,
        '-map', '[out]', '-codec:v', 'copy', '-f', 'avi', 'pipe:1'
    ])
    const  oneSecond = mixingJob.stdout
    //console.log(mixingJob.stderr.toString()) 1285
    console.log("get one second")
    console.log(tracks[0].position)
    console.log(oneSecond)
*/