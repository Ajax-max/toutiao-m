import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// 加载Vant组件库
import Vant from 'vant'
// 加载Vant样式库样式
import 'vant/lib/index.css'
// 全局样式
import './styles/index.less'
// 自动设置 REM 基准值 （HTML 标签字体大小）
import  'amfe-flexible'

import './utils/dayajs'

// import './styles/icon.less'

Vue.use(Vant)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


