let fileTypeFromBuffer = ""; import('file-type').then(mod => fileTypeFromBuffer = mod.fileTypeFromBuffer)
const axios            = require('axios')
const fs               = require('fs')

// TODO change to jpg maker

async function main(pathToM4a, url){
    const response = await axios({url, method: 'GET',responseType: 'stream' })
    let   imgPath  = pathToM4a.replace("m4a", "FILE_ENDING")
    response.data.pipe(fs.createWriteStream(imgPath))

    // wait for download to finish
    await new Promise((resolve, reject) => {
        response.data.on('end', () => {
            resolve()
        })
        response.data.on('error', () => {
            reject()
        })
    })

    const ext  = (await fileTypeFromBuffer(fs.readFileSync(imgPath)))?.ext
    fs.renameSync(imgPath, imgPath.replace("FILE_ENDING", ext))
    imgPath = imgPath.replace("FILE_ENDING", ext)
    return imgPath
}

module.exports.dl = main

// FOR TESTING
// const { dl } = require('./img')
// let foo; dl("cool.m4a","https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/homepage/families-gallery/2022/04_12/family_chooser_tecnica_m.png").then(res=>foo=res)