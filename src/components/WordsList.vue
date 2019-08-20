<template>
  <div class="wordsls-container">
    <div class="alphabet-wrapper">
      <span :class="activeIndex === -2 ? 'active' : ''" @click="selectLetter(-2, 'all')">All</span>
      <Iconfont icon="icon-hot" class="icon-hot" :class="activeIndex === -1 ? 'active' : ''" @click.native="selectLetter(-1, 'hot')"></Iconfont>
      <span 
        v-for="(letter, i) in letterList" 
        :key="i" 
        :class="activeIndex === i ? 'active' : ''"
        @click="selectLetter(i, letter)">{{ letter }}</span>
    </div>
    <el-collapse class="collapse-wrapper">
      <p class="words-none" v-if="wordsList.length === 0">暂无数据</p>
      <el-collapse-item
        v-for="word in wordsList"
        :key="word.id"
        :name="word.id"
        class="collapse-item">
        <template slot="title">
          <h1 class="word-title">{{ word.word }}</h1>
          <Iconfont icon="icon-speaker" fontSize="20" class="icon-speaker" @click.native.stop="speaker(word.word)"></Iconfont>
          <span class="word-item word-pronounce">{{ word.pronounce }}</span>
          <span class="word-item word-mean">{{ word.mean }}</span>
          <el-popover
            placement="left"
            trigger="click"
            class="word-contributor">
            <p class="user-more" v-for="website in word.websiteList" :key="website.id"><a :href="'//' + website.url" target="_blank">{{ website.name }}</a></p>
            <p class="user-more" v-if="!word.websiteList || word.websiteList.length === 0">空空如也</p>
            <span slot="reference" @click.stop="getUserMore(word)">{{ word.name }}</span>
          </el-popover>
        </template>
        <div class="word-examples">
          <div v-for="(example, i) in word.examples" :key="example.id" class="examples-item">
            <p>{{ i + 1 }}. {{ example.en }}</p>
            <span>{{ example.zh }}</span>
          </div>
          <div v-if="word.examples.length === 0">
            <p>暂无实例</p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <audio ref="audio" autoplay="true" :src="pronounceSrc"></audio>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont'
import API from '@/serviceAPI.config.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'WordsList',
  components: {
    Iconfont
  },
  data() {
    return {
      letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
      ],
      activeNames: [1],
      wordsList: [],
      pronounceSrc: '',
      activeIndex: -1,
      websiteMap: {}
    }
  },
  computed: {
    ...mapGetters(['keyWord'])
  },
  created() {
    this.getWordsList({letter: 'hot'})
  },
  methods: {
    getWordsList(params) {
      this.$http.get(API.wordsList, {
        params
      }).then(res => {
        this.wordsList = res.data.data
      })
    },
    speaker(word) {
      var pronounceSrc = `http://dict.youdao.com/dictvoice?audio=${word}&type=1`
      if (this.pronounceSrc === pronounceSrc) {
        this.$refs.audio.play()
      } else {
        this.pronounceSrc = pronounceSrc
      }
    },
    selectLetter(index, letter) {
      this.activeIndex = index
      this.setKeyWord('')
      this.getWordsList({letter})
    },
    getUserMore(word) {
      const { userID, wordID } = word
      if (this.websiteMap[userID]) {
        Vue.set(word, 'websiteList', this.websiteMap[userID])
      } else {
        this.$http.get(API.getUserMore, {
          params: {userID}
        }).then(res => {
          Vue.set(word, 'websiteList', res.data.data)
          this.websiteMap[userID] = res.data.data
        })
      }
    },
    ...mapMutations({
      setKeyWord: 'SET_KEYWORD'
    })
  },
  watch: {
    keyWord() {
      if (this.keyWord === '') {
        return
      }
      this.getWordsList({word: this.keyWord, search: true})
      this.activeIndex = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.wordsls-container {
  margin-top: 50px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .alphabet-wrapper {
    width: 80%;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around;
    .icon-hot {
      line-height: 25px;
      cursor: pointer;
      &:hover, &.active {
        color: $color-red;
      }
    }
    span {
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 50%;
      cursor: pointer;
      &:hover {
        background: $color-shallowgray;
      }
      &.active {
        color: $color-red;
        font-weight: bold;
      }
    }
  }

  .collapse-wrapper {
    width: 80%;
    text-align: left;
    .words-none {
      padding: 10px 0;
      text-align: center;
    }
    .collapse-item {
      position: relative;
    }
    .word-contributor {
      position: absolute;
      right: 30px;
      display: flex;
      span {
        color: $color-blue;
        font-weight: bold;
      }
    }
    .word-title {
      font-weight: bold;
      font-size: 20px;
      margin-right: 20px;
      min-width: 200px;
    }
    .word-item {
      margin: 0 10px;
      &.word-pronounce {
        color: $color-blue;
        font-weight: bold;
      }
    }
    .icon-speaker {
      color: $color-blue;
    }

    .examples-item {
      p {
        font-size: 16px;
      }
      span {
        color: $color-gray;
      }
    }
  }
}
.user-more {
  text-align: center;
  padding: 5px 0;
  a {
    text-decoration: underline;
    color: $color-gray;
  }
}
</style>
