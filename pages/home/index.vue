<template>
  <a-layout class="fullHight">
    <a-layout-header>
      <a-row type="flex" justify="start">
        <a-col :span="3">
          <img src="images/logo.png" style="width: 60px; height: 60px" />
        </a-col>
        <a-col :span="2">
          <a-button ghost
            type="primary"
            style="margin-bottom: 16px;margin-left:16px;"
            @click="toggleCollapsed"
          >
            <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
          </a-button>
        </a-col>
        <a-col :span="19">
          <a-row type="flex" justify="end">
            <a-col :span="4">
              <a-avatar
                style="backgroundcolor: #87d068"
                icon="user"
                align="right"
              />
              <span style="color: #cccccc;margin-left: 16px;">admin</span>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div></div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider>
        <div>
          <a-menu
            :default-selected-keys="['1']"
            :default-open-keys="['sub1']"
            mode="inline"
            theme="dark"
            :inline-collapsed="collapsed"
          >
            <a-menu-item key="1">
              <a-icon type="pie-chart" />
              <span>Option 1</span>
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="desktop" />
              <span>Option 2</span>
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="inbox" />
              <span>Option 3</span>
            </a-menu-item>
            <a-sub-menu key="sub1">
              <span slot="title"
                ><a-icon type="mail" /><span>Navigation One</span></span
              >
              <a-menu-item key="5"> Option 5 </a-menu-item>
              <a-menu-item key="6"> Option 6 </a-menu-item>
              <a-menu-item key="7"> Option 7 </a-menu-item>
              <a-menu-item key="8"> Option 8 </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
              <span slot="title"
                ><a-icon type="appstore" /><span>Navigation Two</span></span
              >
              <a-menu-item key="9"> Option 9 </a-menu-item>
              <a-menu-item key="10"> Option 10 </a-menu-item>
              <a-sub-menu key="sub3" title="Submenu">
                <a-menu-item key="11"> Option 11 </a-menu-item>
                <a-menu-item key="12"> Option 12 </a-menu-item>
              </a-sub-menu>
            </a-sub-menu>
          </a-menu>
        </div>
      </a-layout-sider>
      <a-layout-content>Content</a-layout-content>
    </a-layout>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout>
</template>

<script>
export default {
  transition: "page",
  data() {
    return {
      collapsed: false,
    };
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>