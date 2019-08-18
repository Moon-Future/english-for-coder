import * as types from './mutation-types'

const mutations = {
  [types.SET_KEY_WORD](state, val) {
    state.keyWord = val
  }
}

export default mutations