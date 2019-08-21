<template>
  <div class="admin-container">
    <Header :formStatus="false"></Header>
    <nav-menu></nav-menu>
    <div class="admin-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavMenu from '@/admin/components/NavMenu'
import Header from '@/components/Header'
export default {
  name: 'home',
  components: {
    NavMenu,
    Header
  }
}
</script>

<style lang="scss" scoped>
.admin-content {
  position: absolute;
  left: 200px;
  right: 0;
  top: 50px;
  bottom: 0;
  padding: 20px;
}
</style>
