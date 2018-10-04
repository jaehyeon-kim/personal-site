<template>
  <v-layout row>
    <v-flex xs10 md8 lg6 offset-xs1 offset-md2 offset-lg3>
      <v-toolbar color="grey lighten-2" flat class="mt-2 mb-2">
        <v-toolbar-title>
          <div>
              <span class="headline">{{ article.title }}</span><br>
              <span class="caption">{{ `${dateToString(article.created)}` }}</span><br>                      
          </div>        
        </v-toolbar-title>
        <v-btn absolute icon dark small center right color="grey darken-1" to='/blog'>
            <v-icon size="25">navigate_before</v-icon>
        </v-btn>        
      </v-toolbar>      
      <div id="scroll-target" :style="'max-height:' + (this.windowHeight - 180) + 'px'" class="scroll-y">
        <v-layout v-scroll:#scroll-target="onScroll" column>
          <div style="background: #EEEEEE" class="pl-2 pr-2 pt-2 pb-2" v-html="article.__content"></div>
        </v-layout>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'blogArticle',
  props: {
    id: {
      type: String,
      required: true,
    }
  },
  data() {
    // console.log(require(`../../posts/${this.id}.md`))
    return {
      windowHeight: 0,
      offsetTop: 0,      
      article: require(`../../posts/${this.id}.md`), // eslint-disable-line global-require, import/no-dynamic-require
    }
  },
  computed: {
    dateToString() {
      return this.$store.getters['blog/dateToString']
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
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowHeight);
  }  
}
</script>

<style>
pre > code {
  display: block;
  padding: 1rem;
  word-wrap: normal;
}

img {
    width:600px;
    display: block;
    margin-left: auto;
    margin-right: auto; 
}

blockquote {
  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  quotes: "\201C""\201D""\2018""\2019";
}

blockquote p {
  display: inline;
}
</style>
