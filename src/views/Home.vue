<template>
  <div class="home">
    <Header :formStatus="true"></Header>
    <Search></Search>
    <words-list></words-list>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Search from '@/components/Search'
import WordsList from '@/components/WordsList'
export default {
  name: 'home',
  components: {
    Header,
    Search,
    WordsList
  },
  created() {
    const token = this.$route.query.token
    if (token) {
      localStorage.setItem('token', token)
      this.$router.push({
        path: '/',
      })
    }
  }
}
</script>
