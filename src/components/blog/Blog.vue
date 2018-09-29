<template>
    <v-container fluid grid-list-lg>
        <v-layout row wrap>
            <v-flex xs10 sm8 md6 offset-xs1>
                <v-card max-height="250" v-for="(article, i) in articles" :key="i" class="mb-3">
                    <v-card-text>
                        <div @click="openArticle(article)">
                            <span class="headline">{{ article.title }}</span><br>
                            <span class="caption">{{ `${dateToString(article.created)}` }}</span><br>                      
                        </div>
                    </v-card-text>
                    <v-divider light></v-divider>
                    <v-layout>
                        <div :class="isHidden ? 'flex xs12' : 'flex xs5'">
                            <div @click="openArticle(article)">
                                <v-img
                                    :src="`/static/${article.slug}/main.png`"
                                    height="120"
                                    contain
                                    class="mt-1 mb-1"
                                >
                                </v-img>
                            </div>
                        </div>
                        <v-flex xs7 class="hidden-sm-and-down">
                            <v-card-text>
                                <div @click="openArticle(article)" class="caption mb-1">{{ article.description.substring(0, maxStr) + '... ' }}</div>
                            </v-card-text>      
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
			<div :class="isHidden ? 'flex xs10 sm8 offset-xs1' : 'flex xs10 sm4'">
                <v-layout column>
                    <v-flex>
                        <v-card height="200">
                            First Card
                        </v-card>
                    </v-flex>
                    <v-flex>
                        <v-card height="200">
                            Second Card
                            {{ windowWidth}}
                        </v-card>
                    </v-flex>
                </v-layout>
			</div>
        </v-layout>
    </v-container>
</template>

<script>
// https://codepen.io/developerplus/pen/mBbjBq
// https://www.thepolyglotdeveloper.com/blog/
export default {
  name: 'Blog',
  props: ['slug'],
  data() {
    return {
        windowWidth: 0,
    }
  },  
  computed: {
    isHidden() {
        return this.windowWidth < 960
    },
    maxStr() {
        if (this.windowWidth < 960) {
            return 100
        }
        else if (this.windowWidth < 1264) {
            return 220
        } else if (this.windowWidth < 1600) {
            return 300
        } else {
            return 500
        }
    },
    articles() {
      return this.$store.getters['blog/articles'].sort((a, b) => {
        if (a.created > b.created) return -1
        if (a.created < b.created) return 1
        return 0
      })
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
  mounted() {
    this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth)
        this.getWindowWidth()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth);
  } 
}
</script>
