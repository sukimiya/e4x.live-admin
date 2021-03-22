<template>
  <a-spin :spinning="spinning">
    <a-row style="padding: 32px; width: 100%; height: 100%">
      <a-col>
        <a-table :columns="columns" :data-source="$props.listData" :pagination="myPagination">
          <span slot="time" slot-scope="text">{{
            columnTimesnapToDate(text.time)
          }}</span>
          <span slot="path" slot-scope="record">
            {{ columnFileNamePress(record) }}
          </span>
          <span slot="action" slot-scope="record">
            <a @click="previewMv(record)">下载</a>
          </span>
        </a-table>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
import { downloadMv, requestMv } from "~~/api/login";
import { formatDateTime } from "~~/libs/date-util";
export default {
  props: ["listData", "deviceID"],
  data() {
    return {
      timer: -1,
      spinning: false,
      columns: [
        {
          key: "time",
          title: "时间",
          scopedSlots: { customRender: "time" },
        },
        {
          key: "path",
          title: "文件",
          scopedSlots: { customRender: "path" },
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      myPagination: {
          defaultPageSize: 5
      }
    };
  },
  methods: {
    columnTimesnapToDate(time) {
      return formatDateTime(time, "MM/DD HH:mm:ss");
    },
    columnFileNamePress(record) {
      console.debug("columnFileNamePress ", record.path);
      var pary = record.path.split("/");
      return pary[pary.length - 1];
    },
    previewMv(record) {
      const item = record;
      const path = record.path;
      const self = this;
      const deviceID = this.$props.deviceID;
      this.spinning = true;
      if (self.timer > 0) {
        clearTimeout(self.timer);
        self.time = -1;
      }
      requestMv({ deviceId: deviceID, time: item.time }).then((res) => {
        console.log("requestMv:", res);
        if (res.code !== 0) {
          self.$message.error("没有这个历史视频 :" + res.message, 5);
        } else {
          if (
            res.message === "uploading" ||
            res.message === "require accepted" ||
            res.message === "require apply"
          ) {
            console.log("request history:", res.message);
            self.timer = setTimeout(
              (s) => {
                s.self.previewMv(s.record);
              },
              3000,
              { self: self, record: item }
            );
          } else if (res.message === "ready") {
            this.spinning = false;
            if (self.timer > 0) {
              clearTimeout(self.timer);
              self.time = -1;
            }
            downloadMv({ id: deviceID, file: self.columnFileNamePress(item) });
          }
        }
      });
      // .catch((err) => {
      //   this.$message.error("错误 :" + err.message, 5);
      //   this.spinning = false;
      // });
      console.log("preview history mv", deviceID, { path: path });
    },
  },
};
</script>

<style>
</style>