<template>
  <div class="admin-container">
    <nav-menu></nav-menu>
    <div class="admin-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavMenu from '@/admin/components/NavMenu'
export default {
  name: 'home',
  components: {
    NavMenu
  }
}
</script>

<style lang="scss" scoped>
.admin-content {
  position: absolute;
  left: 200px;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 20px;
}
</style>
