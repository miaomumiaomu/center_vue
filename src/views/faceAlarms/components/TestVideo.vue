<template>
    <div>
        <video id="myvideo" :src="videoSrc" controls :poster="videoImg" autoplay :muted="muteStatus" width="100%" height="312px">
            your browser does not support the video tag
            <!-- :autoplay="playStatus" -->
        </video>
        <!-- <span class="ico ico-sound" :class="{ active: isMute }" v-on:click="closeSoundClick()"></span>
        <span class="ico ico-skip"></span>
        <span class="ico ico-video" :class="{ hide: isPlay }" v-on:click="playClick()"></span> -->
    </div>
</template>

<script>
export default {
    props: {
        videoUrl: null,
    },
    data() {
        return {
            _dom: "",
            videoSrc: '',
            videoImg: '',
            playStatus: '',
            muteStatus: false,
            isMute: true,
            isPlay: false
        }
    },
    watch: {
        videoUrl: {
            handler(val) {
                this.videoSrc = val
            },
            immediate: true
        }
    },
    methods: {
        playClick() {
            this._dom = document.getElementById('myvideo');
            this.isPlay = !this.isPlay;
            this._dom.play();
        },
        closeSoundClick() {
            this.isMute = !this.isMute;
            if (this.isMute) {
                this.muteStatus = '';
            } else {
                this.muteStatus = 'muted';
            }
        }
    }
}
</script>