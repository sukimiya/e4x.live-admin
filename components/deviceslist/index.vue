<template>
  <a-row style="padding: 32px; width: 100%; height: 100%">
    <a-col>
      <a-table :columns="columns" :data-source="$props.listData">
        <span slot="carNumber"
          ><a-tag color="blue" slot-scope="text">{{ text }}</a-tag></span
        >
        <span slot="action" slot-scope="record">
          <a @click="editCarNumber(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="previewMv(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="history(record)">历史</a>
        </span>
      </a-table>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: ["listData"],
  data() {
    return {
      columns: [
        {
          dataIndex: "deviceID",
          key: "deviceID",
          title: "设备号",
        },
        {
          dataIndex: "carNumber",
          key: "carNumber",
          title: "车牌号",
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  methods: {
    columnUploadFeildPress(val) {
      if (val) {
        return "上传中";
      }
      return "等待";
    },
    editCarNumber(record) {
      console.log("change car number:" + record.deviceID + "");
      this.$emit("onEditDevice", record)
    },
    previewMv(record) {
      console.log("preview car mv list:" + record.deviceID + "");
      this.$emit("onPlayVideo", record)
    },
    history(record) {
      console.log("show history:" + record.deviceID + "");
      this.$emit("onSelectDevice", record)
    },
  },
};
</script>

<style>
</style>