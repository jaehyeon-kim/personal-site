<template>
  <v-layout row>
    <v-flex xs10 md8 lg6 offset-xs1 offset-md2 offset-lg3>
      <v-toolbar color="grey lighten-2" flat class="mb-2">
        DO somthing
        <v-btn absolute icon dark small center right color="grey darken-1" to='/'>
            <v-icon size="18">home</v-icon>
        </v-btn>
        <!-- <v-btn icon dark small center right color="grey darken-1" @click="onScroll(ee)">
            <v-icon size="18">close</v-icon>
        </v-btn> -->
      </v-toolbar>
      <div id="scroll-target" :style="'max-height:' + (this.windowHeight - 200) + 'px'" class="scroll-y">
        <v-layout v-scroll:#scroll-target="onScroll" column>
          <v-list two-line>
            <template v-for="(article, index) in articles">
              <v-list-tile
                :key="article.slug"
                avatar
                ripple
                :to="`/blog/${ article.slug }`"
              >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ article.title }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ `${article.created ? article.created.split('T')[0] : ''}`}}</v-list-tile-sub-title>
                    <v-list-tile-sub-title class="caption">{{ article.description }}</v-list-tile-sub-title>
                  </v-list-tile-content>                              
                </v-list-tile>
                <v-divider :key="index"></v-divider>
            </template>
          </v-list>
        </v-layout>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
// https://codepen.io/developerplus/pen/mBbjBq
export default {
  name: 'Blog',
  data() {
    return {
      windowHeight: 0,
      offsetTop: 0
    }
  },  
  computed: {
    articles() {
      return this.$store.getters['blog/articles'].length > 0 ? this.$store.getters['blog/articles'] : []
    }
  },
  methods: {
    getWindowHeight(event) {
        this.windowHeight = document.documentElement.clientHeight
    },
    onScroll (e) {
        this.offsetTop = e.target.scrollTop
    }
  },
  mounted() {
    this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowHeight)
        this.getWindowHeight()
    })
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     setTimeout(() => {
  //       // vm.offsetTop = vm.$store.getters['blog/savedOffset']
  //       window.scrollTo(0, 1000);
  //     }, 500);      
  //   })
  // },  
  // beforeRouteLeave (to, from, next) {
  //   this.$store.commit('blog/updateSavedOffset', this.offsetTop)
  //   next()
  // },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowHeight);
  },  
  created() {
    this.$store.commit('blog/updateArticles')
  }
}
</script>