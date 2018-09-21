<template>
  <div>
    <h1>{{article.title}}</h1>
    <router-link to="/blog">Back</router-link>
    <hr/>
    <div v-html="article.__content"></div>
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
      return {
        // article: {
        //   title: this.id,
        //   body: '<h2>Testing</h2><p>Ok, let\'s do more now!</p>',
        // },
        article: require(`../../posts/${this.id}.md`), // eslint-disable-line global-require, import/no-dynamic-require
      }
    }
  }
</script>