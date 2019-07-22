<style scoped>
.app {
  border: 1px solid #d7dde4;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
<template>
  <div class="app">
    <template v-if="$route.path !== '/login'">
      <Sider
        :style="{
          position: 'fixed',
          height: '100vh',
          left: 0,
          overflow: 'auto'
        }"
      >
        <Menu active-name="1-1" theme="dark" width="auto" :open-names="['1']">
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              商城管理
            </template>
            <MenuItem name="1-1" to="/mall/prd">商品管理</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-keypad"></Icon>
              首页管理
            </template>
            <MenuItem name="2-1" to="/page">页面管理</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout :style="{ marginLeft: '200px' }">
        <Header
          :style="{
            background: '#fff',
            boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'
          }"
        ></Header>
        <Content :style="{ padding: '0 16px 16px' }">
          <Breadcrumb :style="{ margin: '16px 0' }">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <!-- <BreadcrumbItem>Layout</BreadcrumbItem> -->
          </Breadcrumb>
          <Card>
            <div style="height: 600px">
              <router-view></router-view>
            </div>
          </Card>
        </Content>
      </Layout>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>
<script>
export default {};
</script>
