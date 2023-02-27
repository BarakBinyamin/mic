const fs         = require('fs')
const {execSync} = require('child_process')

async function addCoverImg(pathToM4a, song){
    let command = `AtomicParsley "${pathToM4a}"  --overWrite `
    try {
        if (song.artwork){
            const artwork = song.id
            if (fs.existsSync(`../library/${artwork}.jpg`,{root:'.'})){
                command = command + `--artwork "../library/${artwork}.jpg"`
            }else{
                console.log("Img didn't exists")
            }
        }
        result = execSync(command).toString()
    }catch(error){
        console.log(error)
        console.log(error?.output?.[1]?.toString())
    }
}

async function writeTags(pathToM4a, song){
    let command = `AtomicParsley "${pathToM4a}"  --overWrite `
    try{
        if (song.title){
            const title = song.title
            command = command + ` --title "${title}"`
        }
        if (song.artist){
            const artist = song.artist
            command = command + ` --artist "${artist}"`
        }
        if (song.album){
            const album = song.album
            command = command + ` --album  "${album}"`
        }
        if (song.track){
            const track = song.track
            command = command + ` --track  "${track}"`
        }
        if (song.lyrics){
            const lyrics = song.lyrics
            command = command + ` --lyrics "${lyrics}"`
        }
        result = execSync(command, {stdio: 'inherit'})
        await addCoverImg(pathToM4a,song)
    }catch(error){
        console.log(error)
        console.log(error?.output?.[1]?.toString())
    }
}
 
module.exports.writeTags = writeTags

// FOR TESTING
// const { meta } = require('./meta')
// let foo; meta("happy.m4a", "foo.jpg", {"title":"test","artist":"run"} ).then(res=>foo=res)