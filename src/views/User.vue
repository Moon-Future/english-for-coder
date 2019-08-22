<template>
  <div class="user-container">
    <Header></Header>
    <ul class="tab-wrapper">
      <li :class="$route.path === tab.path ? 'active' : ''" v-for="(tab, i) in tabs" :key="i">
        <router-link :to="tab.path">{{ tab.name }}</router-link>
      </li>
    </ul>
    <router-view class="user-bottom"></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'Setting',
  components: {
    Header
  },
  data() {
    return {
      tabs: [
        {name: '贡献词汇', path: '/user/words'},
        {name: '个人信息', path: '/user/profile'},
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.tab-wrapper {
  width: 80%;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: flex-start;
  li {
    margin-right: 20px;
    &.active {
      color: $color-blue;
    }
  }
}
.user-bottom {
  position: absolute;
  top: 90px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  // background-color: $color-shallowgray;
}
</style>