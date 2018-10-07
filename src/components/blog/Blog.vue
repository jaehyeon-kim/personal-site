<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs10 md6 offset-xs1 offset-md2>
                <div v-for="(article, i) in selected" :key="i" @click="openArticle(article)">
                    <v-card class="my-3" hover>
                        <v-card-text>
                            <div class="mb-2">
                                <span class="headline">{{ article.title }}</span><br>
                                <span class="caption">{{ `${dateToString(article.created)}` }}</span><br>                      
                            </div>
                            <v-divider></v-divider>
                            <v-layout row wrap class="mt-4">
                                <v-flex xs6 v-if="windowWidth > 1000">
                                    <v-img
                                        height="180"
                                        :src="`/static/main/${article.slug}.png`"
                                        contain
                                    >
                                    </v-img>
                                </v-flex>
                                <div :class="`${windowWidth > 1000 ? 'flex xs6' : 'flex xs12'}`">
                                    {{ article.description.substring(0, 400) + '... ' + 'READ MORE' }}
                                </div>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </div>
            </v-flex>
			<div class="fixed" v-if="windowWidth > 1000">
                <app-blog-side></app-blog-side>
			</div>          
        </v-layout>
    </v-container>
</template>

<script>
import BlogSide from '@/components/blog/BlogSide'

export default {
  name: 'Blog',
  props: ['slug'],
  data() {
    return {
        windowWidth: 0,
        drawer: true
    }
  },  
  computed: {
    articles () {
      return this.$store.getters['blog/articles'].sort((a, b) => {
        if (a.created > b.created) return -1
        if (a.created < b.created) return 1
        return 0
      })
    },
    selected () {
        return this.$store.getters['blog/selected']
    },
    dateToString() {
      return this.$store.getters['blog/dateToString']
    }
  },
  methods: {
    getWindowWidth(event) {
        this.windowWidth = document.documentElement.clientWidth
    },
    openArticle(article) {
        this.$router.push({ path: `/blog/${ article.slug }` })
    }
  },
  components: {
      appBlogSide: BlogSide
  },
  mounted() {
    this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth)
        this.getWindowWidth()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth)
  } 
}
</script>

<style scoped>
.fixed {
  position: fixed;
  width: 320px;
  top:8%; 
  right:4%;
}
</style>
