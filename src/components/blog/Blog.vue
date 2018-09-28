<template>
    <v-container grid-list-sm fluid>
        <v-layout row wrap justify-center align-center>
                <v-card width="600" max-height="250" v-for="(article, i) in articles" :key="i" class="ml-3 mr-3 mb-3">
                    <v-card-text>
                        <div>
                            <span class="headline">{{ article.title }}</span><br>
                            <span class="caption">{{ `${dateToString(article.created)}` }}</span><br>                      
                        </div>
                    </v-card-text>
                    <v-divider light></v-divider>
                    <v-layout>
                        <v-flex xs5>
                            <v-img
                                :src="`/static/${article.slug}/main.png`"
                                height="150"
                                width="200"
                                contain
                                class="ml-3"
                                :to="`/blog/${ article.slug }`"
                            >
                            </v-img>
                        </v-flex>
                        <v-flex xs7>
                            <v-card-text>
                                <span class="caption">{{ article.description.substring(0, 220) + '...' }}</span><br>
                                <v-btn flat small block color="primary" :to="`/blog/${ article.slug }`">
                                    read more
                                    <v-icon>fast_forward</v-icon>
                                </v-btn>                                
                            </v-card-text>                       
                        </v-flex>
                    </v-layout>
                </v-card>
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
    }
  },  
  computed: {
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
  }
}
</script>
