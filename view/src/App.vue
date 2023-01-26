<template>
  <div class="main-panel">
    <div class="now-playing">
      <nowplaying :playing="playing" :title="songInfo.title" :artist="songInfo.artist" :artsrc="songInfo.artsrc"/>
    </div>
    <div class="up-next">
      <upnext/>
    </div>
  </div>
  <div class="play-container">
    <div class="play" @click="playing=!playing">
      <svg v-if="playing" xmlns="http://www.w3.org/2000/svg" class="bi bi-pause pause" viewBox="0 0 16 16"> <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/> </svg> 
      <svg v-else xmlns="http://www.w3.org/2000/svg" style="margin-left:8px;margin-top:5px;" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16"> <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/> </svg> 
    </div>
  </div>
  <radio v-model:playing="playing"/>
  <metaEmitter @update="update"/>
</template>

<script>
import nowplaying  from "./components/nowplaying.vue"
import upnext      from "./components/upnext.vue"
import radio       from "./components/radio.vue"
import metaEmitter from "./components/metadata.vue"

export default{
  components: { radio, nowplaying, upnext, metaEmitter },
  data (){
    return {
      playing : false,
      songInfo: {
        title: "nothin'",
        artist: "nobody",
        artsrc: ""
      }
    }
  },
  methods:{
    update(info){
      console.log("Updated Metadata")
      this.songInfo.title = info.title
      this.songInfo.artist= info.artist
      this.songInfo.artsrc= info.artsrc
    }
  }
}
</script>

<style>
html{
  touch-action: none;
  -webkit-overflow-scrolling: touch; /* enables “momentum” (smooth) scrolling */
  /* Nice Font */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body{
  width:100%;
  height:100%;
  overflow: auto;
  margin:0 auto;
}

.main-panel{
  position: absolute;
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: 50%;
}

.now-playing{
  display:block;
  /* background: blue; */
  height: 100%;
  width: 100%;
}

.up-next{
  display:block;
  background: red;
  height: 100%;
  width: 100%;
}

.play-container{
  width: 100%;
  height: 100%;
  position: absolute;
  display: grid;
  align-items: center;
  justify-content: center;
}

.play{
  display :    block;
  margin:      0;
  padding:     0;
  height:      100px;
  width:       100px;
  border-radius: 100%;
  z-index:       1;
  background:  whitesmoke;
}

.play:hover{
  box-shadow: 0px 0px 50px 10px rgba(0,0,0,1);
}

@media only screen and (max-width: 600px) {
  .play:hover {
    box-shadow: 0px 0px 50px 10px rgba(0,0,0,0);
  }
}
</style>
