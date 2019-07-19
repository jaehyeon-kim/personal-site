<template>
  <div>
    <v-layout row>
      <v-flex xs10 md8 lg6 offset-xs1 offset-md2 offset-lg3>
        <v-toolbar dense flat color="grey lighten-2" class="mt-2 mb-2">
          <v-toolbar-title>
            <div>
                <div class="title mt-3">{{ article.title }}</div>
                <div class="caption mt-1 mb-2">{{ `${dateToString(article.created)}` }}</div>
            </div>        
          </v-toolbar-title>
          <v-btn absolute icon dark small center right color="grey darken-1" @click="$router.go(-1)">
              <v-icon size="25">navigate_before</v-icon>
          </v-btn>        
        </v-toolbar>
        <v-layout column>         
          <div style="background: #EEEEEE" class="pl-2 pr-2 pt-2 pb-2" v-html="article.__content"></div>
        </v-layout>      
      </v-flex>
    </v-layout>
    <div class="fixed" v-if="scrollY > 150">
      <v-layout row wrap>
        <v-btn icon dark small color="grey darken-1 fixed" @click="$router.go(-1)">
            <v-icon size="25">navigate_before</v-icon>
        </v-btn>
      </v-layout>
    </div>
  </div>
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
      scrollY: 0,      
      article: require(`../../posts/${this.id}.md`), // eslint-disable-line global-require, import/no-dynamic-require
    }
  },
  computed: {
    dateToString() {
      return this.$store.getters['blog/dateToString']
    }    
  },
  methods: {
    onScroll (e) {
        this.scrollY = window.scrollY
    }
  },
  mounted() {
    this.$nextTick(function() {
        window.addEventListener('scroll', this.onScroll)
        this.onScroll()
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  }  
}
</script>

<style>
code, p {
  font-size: 1.1em;
}

pre > code {
  display: block;
  padding: 1rem;
  word-wrap: normal;
}

h2, h3, h4 {
  margin-top: 20px;
  margin-bottom: 20px;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;    
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

.fixed {
  position: fixed;
  top: 0%;
  right: 15%
}
</style>
