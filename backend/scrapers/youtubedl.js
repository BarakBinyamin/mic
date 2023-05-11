const youtubedl      = require('youtube-dl-exec')
const { v4: uuidv4 } = require('uuid')
const fs             = require('fs')

const TMP = "./scrapers/tmp/" // top level path for youtubedl

const getInfo = async (url, flags) => {
  return youtubedl(url, { dumpSingleJson: true, ...flags })
}
const fromInfo = async (infoFile, flags) => {
  return youtubedl.exec('', { f : 'bestaudio[ext=m4a]', loadInfoJson: infoFile, ...flags })
}

async function main (downloadPath, url) {
  try{
    const info          = await getInfo(url)
    const VideoInfoPath = `${TMP}${uuidv4()}`
    fs.writeFileSync(VideoInfoPath, JSON.stringify(info))

    // and finally we can download the video
    await fromInfo(VideoInfoPath, { output: `${downloadPath}.m4a`})

    fs.rmSync(VideoInfoPath)
    return true
  }catch(error){
    const msg = new Error(`failed to download from youtube, may be a bad url ${url}...`)
    console.error(error)
    console.error(msg)
    return false
  }
}

module.exports.youtubedl = main

// FOR TESTING
// const { youtubedl } = require('./scrapers/youtubedl')
// let response; youtubedl("cool", "https://www.youtube.com/watch?v=SebH8En9ZOY").then(res=>response=res)