import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import pt from 'vuetify/es5/locale/pt'

Vue.use(Vuetify, {
  theme: {
    primary: '#455A64',
    secondary: '#616161',
    accent: '#00796B',
    error: '#E64A19',
    info: '#1976D2',
    success: '#689F38',
    warning: '#F57C00',
  },
  options: {
    customProperties: true
  },
  iconfont: 'fa',
  lang: {
    locales: { pt },
    current: 'pt'
  },
})
