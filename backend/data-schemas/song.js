class Song {
    constructor(){
        this.id          = ""
        this.title       = ""
        this.album       = ""
        this.artist      = ""
        this.lyrics      = ""
        this.releasedate = ""

        this.youtube     = ""
        this.spotify     = "" 
        
        this.isloading   = true   // is fetching
        this.status      = false  // if isloading==false, this indicate if fetching was successful by youtubetomp3
    }
}

module.exports.Song = Song