import * as types from './mutation-types'
import API from '../serviceAPI.config'

const actions = {
  setUserInfoSync(store, data = {}) {
    console.log('xxx')
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem('token')
      if (!token) {
        store.commit(types['SET_USERINFO'], {userInfo: {}, status: false})
        resolve()
      } else {
        axois.post(API.getUserInfo, {token}).then(res => {
          store.commit(types['SET_USERINFO'], {userInfo: res.data.userInfo, status: res.data.loginStatus})
          resolve()
        })
      }
    })
  }
}

export default actions