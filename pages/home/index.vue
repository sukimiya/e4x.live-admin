<template>
  <a-layout class="fullHight">
    <a-layout-header>
      <a-row type="flex" justify="start">
        <a-col :span="3">
          <img src="images/logo.png" style="width: 60px; height: 60px" />
        </a-col>
        <a-col :span="2">
          
        </a-col>
        <a-col :span="19">
          <a-row type="flex" justify="end">
            <a-col :span="4">
              <a-avatar
                style="backgroundcolor: #87d068"
                icon="user"
                align="right"
              />
              <span style="color: #cccccc; margin-left: 16px">admin</span>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div></div>
    </a-layout-header>
    <a-layout>
      <a-layout-content>
        <a-row type="flex" justify="start">
          <a-col>
            <a-page-header
              style="border: 0px solid rgb(235, 237, 240)"
              title="Home"
              sub-title="Devices List"
              @back="() => $router.go(-1)"
            />
          </a-col>
        </a-row>
        <a-row type="flex" justify="start">
          <a-col :span="24">
            <DevicesList
              :listData="devicesListData"
              @onPlayVideo="onPlayVideoHandler"
              @onSelectDevice="onSelectDeviceHandler"
              @onEditDevice="onEditDeviceHandler"
            />
          </a-col>
        </a-row>
        <a-modal
          :top="0"
          v-model="isHistoryOpen"
          :afterClose="onModelClose"
          :title="modelTitle"
          :closable="true"
          style="border: 0px solid rgb(235, 237, 240)"
        >
          <MovieList :deviceID="openDeviceID" :listData="moviesData" />
        </a-modal>
        <a-modal
          v-model="isVideoPlayOpen"
          :title="playerTitle"
          :closable="true"
          :width="700"
        >
          <VideoPlayer :playerOptions="videoOptions" />
        </a-modal>
        <a-modal
          v-model="editOpen"
          :title="editeTitle"
          @ok="handleEditOk"
          :closable="true">
          <a-form >
            <a-form-item>
              <a-input v-model="currentEditDevice.carNumber"
                v-decorator="[
                  '车牌号',
                  { rules: [{ required: true, message: '请输入车牌号' }] },
                ]"
                placeholder="请输入车牌号"
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout>
</template>

<script>
import { getAllDevices } from "~~/api/login";
import DevicesList from "~~/components/deviceslist/index.vue";
import MovieList from "~~/components/movieslist/index.vue";
import VideoPlayer from "~~/components/videoplayer.vue";
export default {
  transition: "page",
  data() {
    return {
      collapsed: false,
      isHistoryOpen: false,
      isVideoPlayOpen: false,
      editOpen: false,
      modelTitle: "",
      playerTitle: "",
      editeTitle: "",
      openDeviceID: null,
      devicesListData: [],
      moviesData: [],
      videoOptions: {},
      videoSource: "",
      currentEditDevice: {
        deviceID: null,
        carNumber: null
      },
      defaultVideoOption: {
        height: "360",
        autoplay: true,
        muted: false,
        language: "zh-CN",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        poster: "",
      },
    };
  },
  created() {
    const self = this;
    getAllDevices().then((res) => {
      console.log("getAllDevices:", res);
      if (res && res.length > 0) {
        var i = 0;
        self.devicesListData = res;
      }
    });
  },
  components: { DevicesList, MovieList, VideoPlayer },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    onModelClose() {
      this.modelTitle = "";
      this.moviesData = [];
    },
    onPlayVideoHandler(record) {
      console.log("onPlayVideoHandler", record, this.$refs.vp);
      this.isVideoPlayOpen = true;
      this.playerTitle =
        "直播设备 " + record.carNumber ? record.carNumber : ecord.deviceID;
      this.videoSource = record.upStreamUrl;
      var playUrl = record.upStreamUrl + "/playlist.m3u8"
      playUrl = playUrl.replace(":1935/", ":5088/").replace("rtmp://", "http://")
      this.videoOptions = {
        ...this.defaultVideoOption,
        sources: [
          {
            withCredentials: false,
            type: "application/x-mpegURL",
            src: playUrl,
          },
        ],
      };
    },
    onSelectDeviceHandler(record) {
      console.debug("onSelectDeviceHandler", record);
      this.openDeviceID = record.deviceID;
      this.modelTitle =
        "" + record.carNumber ? record.carNumber : ecord.deviceID + "的历史";
      this.moviesData = record.records;
      this.isHistoryOpen = true;
    },
    onEditDeviceHandler(record) {
      this.currentEditDevice = record
      this.editOpen = true
      this.editeTitle = '修改设备' + record.deviceID
    },
    handleEditOk() {
      this.editOpen = false
    }
  },
};
</script>
<style scoped>
</style>