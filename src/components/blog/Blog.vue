<template>
  <div>
    <article v-for="article in articles" :key="article.slug">
      <router-link :to="`/blog/${ article.slug }`">
        <h2>{{ article.title }}</h2>
        <p>{{article.description}}</p>
      </router-link>
    </article>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Blog',
  computed: {
    articles() {
      return this.$store.getters['blog/articles']
    }
  },
  created() {
    this.$store.commit('blog/updateArticles')
  }
}
</script>