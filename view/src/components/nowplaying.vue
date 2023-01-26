<template>
    <div v-if="artsrc"   class="big-container" :style="backgroundStyle()"></div>
    <img v-else          class="big-container-else" src='../assets/standby.jpeg'/>
    <div :style="{color: background}" class="title">Pebblez Radio</div>
    <div :style="{color: background}" class="container">
        <div class="nowplaying">
            Now Playing
        </div>
        <img :style="imgStyle()" :src="artsrc" id="cover-art" class="cover-art"/>
        <div class="description">
            {{title}} by {{artist}}
        </div>
    </div>
</template>

<script>
import getAverageRGB from "../assets/getAvgColor.js"

export default{
    props: ["playing","title","artist","artsrc"],
    data(){
        return{
            background: "grey",
            color     : "grey"
        }
    },
    mounted(){
        const artDiv    = document.getElementById('cover-art')
        const rgb       = getAverageRGB(artDiv)
        this.background = `rgba(${250-rgb.r},${250-rgb.g},${250-rgb.b},.8)`
    },
    methods:{
        imgStyle(){
            return {
                'box-shadow': `0px 0px 10px 5px ${this.color}`
            }
        },
        backgroundStyle(){
            return {
                'background-image': `url(${this.artsrc})` 
            }
        }
    }
}
</script>

<style scoped>
.big-container{
    position: absolute;
    background-size: cover; 
    filter: blur(15px);
    -webkit-filter: blur(15px);
    height: 50%;
    width: 100%;
    opacity: 1;
    z-index: -1;
}
.big-container-else{
    position: absolute;
    background-size: cover; 
    height: 50%;
    width: 100%;
    opacity: 1;
    z-index: -1;
}
.title{
    font-size: 40px;
    text-align: center;
    margin-top: 5px;
    font-weight: 500;
    height: 50px;
    overflow: hidden;
}
.container{ 
    display: grid;
    width: 100%;
    height: calc(100% - 50px - 5px - 40px );
    /* background: white; */
    justify-content: center;
    justify-items: center;
    align-items: center;
}
.nowplaying{
    margin-top: -15px;
    margin-bottom: -25px;
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    padding: 5px;
}
.cover-art{
    display: block;
    background: black;
    height: 125px;
    width: 125px;
    border-radius: 5px;
}
.description{
    margin-top: -20px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    overflow: hidden;
}
</style>