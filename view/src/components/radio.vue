<template>
    <audio id="pebblez-audio"></audio>
    <div id="visual"></div>
</template>

<script>
export default {
    props: ["playing"],
    mounted(){
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler("pause", async ()=>{await this.pause()})
            navigator.mediaSession.setActionHandler("play", async ()=>{await this.play()})
        }
    },
    methods: {
        async listen(){
            let music = document.getElementById('pebblez-audio')
            music.src="/api/nowplaying"
            music.play()

        },
        async stop(){
            let music = document.getElementById('pebblez-audio')
            music.pause()
            music.src=""
        },
        async pause(){
            let music = document.getElementById('pebblez-audio')
            music.pause()
            this.playing=false
            this.$emit("update:playing", this.playing)
        },
        async play(){
            let music = document.getElementById('pebblez-audio')
            music.play()
            this.playing=true
            this.$emit("update:playing", this.playing)
        },
    },
    watch: {
        playing : function(){
            if (this.playing){
                this.listen()
            }
            else{
                this.stop()
            }
        }
    }
}
</script>