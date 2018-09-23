import Vue from 'vue'
import Vuex from 'vuex'

import blog from './blog'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        blog
    }
  })
  
  export default store