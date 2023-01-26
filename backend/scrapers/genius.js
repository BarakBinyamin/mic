const axios   = require('axios')
const cheerio = require('cheerio')
const jsdom   = require("jsdom")
const {JSDOM} = jsdom

/*
* Searches genius.com for song and album information...
* Sometimes it even includes youtube & spotify links!
* There is an npm project but I like mine better https://www.npmjs.com/package/genius-lyrics
*/

async function getGeniusData(geniusLink){
    if (!geniusLink.includes('genius.com') || geniusLink==="https://genius.com/"){return {"type": "info", "info":"couldn't find it :/", "url": geniusLink}}
    const result    = await axios.get(geniusLink, {
        'User-Agent' : "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0"
    })

    // Find the script tag with all the data in it
    const html      = result.data
    let  $          = cheerio.load(html)
    let scriptTags  = $('script')
    let infoTags    = [...scriptTags].filter(tag=>{
        let info    = tag.children[0]?.data
        return info?.includes("JSON")
    })
    let tagData     = infoTags[0].children[0].data
    let tag         =`<script>${tagData}</script>`
    // Run the script tag and grab the gloabl variable __PRELOADED_STATE__
    const dom = new JSDOM(tag, { runScripts: "dangerously", resources: "usable" });
    const info =  await new Promise((resolve) => {
        dom.window.addEventListener("load", () => {
            resolve(dom.window.__PRELOADED_STATE__)
        })
    })

    // If __PRELOADED_STATE__.currentPage is not a song page, look for albumn data
    if (info?.currentPage === "songPage"){
        return     { "type" : "song", "info": info }
    }else{
        const metaTags   =  $('meta')
        const albumnTag  = [...metaTags].filter(item=>item?.attribs?.content?.includes('chartbeat'))[0]
        const albumnInfo = JSON.parse(albumnTag.attribs.content)
        if (albumnInfo['album_appearances']){
            return { "type" : "album", "info": albumnInfo }
        } else{
            return {"type": "info", "info":"probably an artist", "url":geniusLink}
        }
    }
}

async function getReleventSongData(geniusData){
    const songPage   = geniusData.songPage
    const trackData  = songPage.trackingData
    const songRefNum = String(songPage.song)
    const songData   = geniusData.entities.songs[songRefNum]
    const url        = songData.url
    let   info       = {}
    info.lyrics      = songPage.lyricsData.body.html.replace(/[<][^>]*[>]/g,'')?.replace(/&amp;/g, "&").replace(/"/g,'\\"') //.replace(/[^A-z0-9[]'",-_\/]/g,'')
    info.title       = [...trackData].filter(item=>item.key==="Title").map(item=>item.value)[0]?.replace(/&amp;/g, "&").replace(/"/g,'\\"') //.replace(/[^A-z0-9[]'",-_\/]/g,'')
    info.artist      = [...trackData].filter(item=>item.key==="Primary Artist").map(item=>item.value)[0]?.replace(/&amp;/g, "&").replace(/"/g,'\\"') //.replace(/[^A-z0-9[]'",-_\/]/g,'')
    info.album       = [...trackData].filter(item=>item.key==="Primary Album").map(item=>item.value)[0]?.replace(/&amp;/g, "&").replace(/"/g,'\\"') //.replace(/[^A-z0-9[]'",-_\/]/g,'')
    info.artwork     = songData.customSongArtImageUrl || songData.songArtImageUrl
    info.releaseDate = songData.releaseDateForDisplay
    info.youtubelink = songData.youtubeUrl
    info.spotifyUuid = songData.spotifyUuid
    return {"type": "song", "info":info, "url" : url}
}

async function getReleventAlbumnData(geniusData){
    const album    = geniusData.album
    const url      = album.url
    let   info     = {}
    info.trackdata = geniusData['album_appearances']
    info.tracks    = geniusData['album_appearances'].map(item=>item.song.full_title)     // To get full genius data grab item.song.url
    info.album     = album.name
    info.artwork   = album['cover_art_url']
    return {"type": "album", "info":info, "url" : url}
}

async function imFeelingLucky(whatever){
    const googleURL = `https://www.google.com/search?q=${encodeURI(whatever.replace(/ /g,"+"))}`
    const result    = await axios.get(googleURL, {
        'User-Agent' : "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0"
    })
    const html      = result.data
    const linkTag   = /<a href="\/url?[^>]*>/g
    const luckyTag  = html.match(linkTag)[0]
    const linkRegex = /http[^&]*/
    const link      = luckyTag.match(linkRegex)[0]
    return link
}


async function main(somesong){
    const text         = `genius ${somesong}`
    const geniusLink   = await imFeelingLucky(text)
    const geniusStuff  = await getGeniusData(geniusLink) 
    if        (geniusStuff?.type === "song"){
        const  info    = await getReleventSongData(geniusStuff.info)
        return info
    } else if (geniusStuff?.type === "album") {
        const  info    = await getReleventAlbumnData(geniusStuff.info)
        return info
    } else{
        const  error   = geniusStuff
        return error
    }
}

module.exports.genius = main

// FOR TESTING
// const { genius } = require('./lib//genius')
// let foo; genius("under the sea").then(res=>foo=res)