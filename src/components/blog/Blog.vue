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
// https://webpack.js.org/api/module-methods/#require-context
// require.context() method accepts three arguments.
// * the directory where it will search
// * whether or not to include subdirectories
// * a regex filter to return files

const posts = {};
const req = require.context('../../posts/', false, /\.md$/);
req.keys().forEach((key) => {
  posts[key] = req(key);
})

export default {
  name: 'Blog',
  computed: {
    articles() {
      const articleArray = []
      Object.keys(posts).forEach((key) => {
        const article = posts[key]
        article.slug = key.replace('./', '').replace('.md', '')
        articleArray.push(article)
      })
      return articleArray
    }
  }
}

// export default {
//   name: 'blog',
//   computed: {
//     articles() {
//       return [
//         {
//           slug: 'first-article',
//           title: 'Article One',
//           description: 'This is article one\'s description',
//         },
//         {
//           slug: 'second-article',
//           title: 'Article Two',
//           description: 'This is article two\'s description',
//         },
//       ];
//     },
//   },
// };
</script>