<template>
    <div></div>
</template>

<script>
import { io } from "socket.io-client"

export default{
    mounted(){
        console.log("subsrcibe requested")
        const socketio = io()
        socketio.on("update", (metadata)=>{this.updateMetadata(metadata)})
    },
    methods:{
        updateMetadata(metadata){
            console.log("recieved update message")
            this.$emit("update", metadata)
            if ('mediaSession' in navigator) {
                if (metadata?.title){
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title:   `Pebblez Radio - ${metadata?.title}`,
                        artist:  metadata?.artist,
                        album:   metadata?.album,
                        artwork: [
                            { src:  metadata?.artsrc,  type: 'image/jpeg' },
                        ]
                    })
                }else{
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title:   `Pebblez Radio`,
                        // artist:  "",
                        // album:   "",
                        artwork: [
                             { src:  "/api/img?id=whitenoise",  type: 'image/jpeg' },
                        ]
                    })
                }
            }
        }
    }
}
</script>