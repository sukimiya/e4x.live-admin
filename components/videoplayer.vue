<template>
  <div class="item physical-video">
    <video-player
      class="confVideo vjs-custom-skin video-player"
      ref="videoPlayer"
      :options="$props.playerOptions"
      :playsinline="true"
    >
    </video-player>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
  props: ["playerOptions"],
  components: {
    videoPlayer,
  },
  mounted() {
    console.log("当前videojs对象", this.player);
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  data() {
    return {
      // playerOptions: {
      //   height: '360',
      //   autoplay: true,
      //   muted: true,
      //   language: 'en',
      //   playbackRates: [0.7, 1.0, 1.5, 2.0],
      //   sources: [{
      //     type: "video/mp4",
      //     src: "http://vjs.zencdn.net/v/oceans.mp4",
      //   }],
      //   poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg",
      // }
    };
  },
};
</script>
<style scoped>
.physical-video {
  width: 100%;
  height: 100vh;
}
</style>
<style>
.physical-video .video-js.vjs-custom-skin {
  height: 100vh;
}
.physical-video .video-js.vjs-custom-skin .vjs-control-bar {
  height: 90px;
}
.physical-video .video-js.vjs-custom-skin .vjs-control {
  width: 4em !important;
}
.physical-video .video-js .vjs-time-control,
.physical-video
  .video-js.vjs-custom-skin
  .vjs-control-bar
  .vjs-playback-rate
  .vjs-playback-rate-value {
  font-size: 2em !important;
  line-height: 3em !important;
}
.physical-video .video-js .vjs-control:before {
  height: 50px;
  font-size: 4em;
}
</style>