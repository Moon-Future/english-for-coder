<template>
  <div class="wordsls-container">
    <div class="alphabet-wrapper">
      <Iconfont class="hot-icon active"></Iconfont>
      <span v-for="(letter, i) in letterList" :key="i">{{ letter }}</span>
    </div>
    <el-collapse @change="handleChange" class="collapse-wrapper">
      <el-collapse-item
        v-for="word in wordsList"
        :key="word.id"
        :name="word.id"
        class="collapse-item">
        <template slot="title">
          <h1 class="word-title">{{ word.word }}</h1>
          <span class="word-mean">{{ word.mean }}</span>
        </template>
        <div class="word-examples">
          <div class="examples-item">
            <p>1. an example that was fundamental to the argument.</p>
            <span>论据中的一个主要例证</span>
          </div>
          <div class="examples-item">
            <p>2. an example that was fundamental to the argument.an example that was fundamental to the argument.an example that was fundamental to the argument.an example that was fundamental to the argument.an example that was fundamental to the argument.</p>
            <span>论据中的一个主要例证论据中的一个主要例证论据中的一个主要例证论据中的一个主要例证论据中的一个主要例证论据中的一个主要例证论据中的一个主要例证论据中的一个主要例证论据中的一个主要例证论据中的一个主要例证</span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont'
import API from '@/serviceAPI.config.js'
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
      wordsList: []
    }
  },
  created() {
    this.$http.get(API.wordsList, {
      params: {letter: 'hot'}
    }).then(res => {
      console.log(res.data)
      this.wordsList = res.data.data
    })
  },
  methods: {
    handleChange() {

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
    .hot-icon {
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
      .active {
        color: $color-red;
      }
    }
  }

  .card-item {
    width: 30%;
    margin: 10px;
    text-align: left;
    font-size: 14px;
    .word-title {
      span {
        font-weight: bold;
        font-size: 20px;
      }
    }
  }

  .collapse-wrapper {
    width: 80%;
    text-align: left;
    .word-title {
      font-weight: bold;
      font-size: 20px;
      margin-right: 20px;
      min-width: 200px;
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
</style>
