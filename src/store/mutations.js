import * as types from './mutation-types'

const mutations = {
  [types.SET_KEYWORD](state, val) {
    state.keyWord = val
  },
  [types.SET_USERINFO](state, {userInfo, status}) {
    state.userInfo = userInfo
    state.loginStatus = status
  }
}

export default mutations