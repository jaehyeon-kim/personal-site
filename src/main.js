// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)

import 'prismjs'
import 'prismjs/themes/prism-coy.css'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/components/prism-r'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'

import VuePrism from 'vue-prism'
Vue.use(VuePrism)

import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import wordcloud from 'highcharts/modules/wordcloud'
import exportingInit from 'highcharts/modules/exporting'
exportingInit(Highcharts)
wordcloud(Highcharts)
Vue.use(HighchartsVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
