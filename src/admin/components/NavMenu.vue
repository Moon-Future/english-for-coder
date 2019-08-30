<template>
  <div class="menu-container">
    <el-menu
      :default-active="active"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true">
      <el-menu-item v-for="menu in menuList" :index="menu.index" :key="menu.index">
        <i :class="menu.icon"></i>
        <span slot="title">{{ menu.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'navMenu',
  data() {
    return {
      menuList: [
        {icon: 'el-icon-collection', name: '词汇', index: '/admin/words'},
        {icon: 'el-icon-collection', name: '用户', index: '/admin/user'}
      ],
      active: '/admin/words'
    }
  },
  created() {
    this.active = this.$route.path
  },
  watch: {
    $route() {
      this.active = this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-container {
    width: 200px;
    text-align: left;
    position: fixed;
    top: 50px;
    bottom: 0;
    background: #545c64;

    .el-menu {
      border-right: none;
    }
  }
</style>
