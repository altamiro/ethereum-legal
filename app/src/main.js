import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/vuetify'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/css/default.css';

import './plugins/vue-echarts'

import i18n from './i18n'

Vue.config.productionTip = false
Vue.config.silent = true;
Vue.mixin({
  methods: {
    splash: function () {
      this.$store.commit('TOGGLE_LOADING');
    },
  },
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
