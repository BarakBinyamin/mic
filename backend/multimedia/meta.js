const fs         = require('fs')
const {execSync} = require('child_process')

// brew install atomicparsley 
// sudo apt-get install atomicparsley
 
async function writeTags(pathToM4a, tags){
    let command = `AtomicParsley "${pathToM4a}"  --overWrite ` // atomicparsley on mac

    if (tags.artwork){
        const artwork = tags.id
        if (fs.existsSync(`../library/${artwork}.jpg`,{root:'.'})){
            command = command + `--artwork "../library/${artwork}.jpg"`
        }else{
            console.log("Img didn't exists")
        }
    }
    if (tags.title){
        const title = tags.title
        command = command + ` --title "${title}"`
    }
    if (tags.artist){
        const artist = tags.artist
        command = command + ` --artist "${artist}"`
    }
    if (tags.album){
        const album = tags.album
        command = command + ` --album  "${album}"`
    }
    if (tags.track){
        const track = tags.track
        command = command + ` --track  "${track}"`
    }
    if (tags.lyrics){
        const lyrics = tags.lyrics
        command = command + ` --lyrics "${lyrics}"`
    }
    const result  = execSync(command, {encoding: 'utf8'})
}
 
module.exports.writeTags = writeTags

// FOR TESTING
// const { meta } = require('./meta')
// let foo; meta("happy.m4a", "foo.jpg", {"title":"test","artist":"run"} ).then(res=>foo=res)