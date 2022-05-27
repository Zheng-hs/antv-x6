import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import vcolorpicker from 'vcolorpicker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Message,
  MessageBox
} from 'element-ui' //引入Message, MessageBox

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Antd);
Vue.use(vcolorpicker)
Vue.prototype.$message = Message //vue实例上挂载Message                
Vue.prototype.$confirm = MessageBox.confirm //vue实例上挂载MessageBox  

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
