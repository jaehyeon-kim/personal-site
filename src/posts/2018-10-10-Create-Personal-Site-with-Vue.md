---
title: 'Create Personal Site with Vue'
category: 'Web Development'
tags: [AWS, CloudFront, Route53, Vue.js, JavaScript]
created: '2018-10-10'
updated:
status: publish
description: "I find it's interesting to share something that interests me with others. It's been for about 4 years since I started blogging. Being an R user, I tend to write posts using RMarkdown so that dynamic contents including outputs of code snippets can easily be converted into Markdown. The old blog is created by Jekyll and served via GitHub Pages. When I became interested in web development, I thought to build a personal website rather than a simple blog. Recently I've been building web apps for my company using Vue.js and I become confident that I would be able to create a site on my own."
---

I find it's interesting to share something that interests me with others. It's been for about 4 years since I started blogging. Being an R user, I tend to write posts using [RMarkdown](https://rmarkdown.rstudio.com/) so that dynamic contents including outputs of code snippets can easily be converted into markdown. My [old blog](http://jaehyeon-kim.github.io/) is created by [Jekyll](https://jekyllrb.com/) and served via GitHub Pages. When I became interested in web development, I thought to build a personal website rather than a simple blog. Recently I've been building web apps for my company using [Vue.js](https://vuejs.org/) and I become confident that I would be able to create a site on my own.

There are many options to create a personal website using Vue.js - [Vuelog](https://vuelog.js.org), [VuePress](https://vuepress.vuejs.org/), [blog-module of Nuxt](https://github.com/nuxt-community/blog-module) and so on. However I decided not to use any after reading this interesting post - [The Rise of the Butt-less Website](https://css-tricks.com/the-rise-of-the-butt-less-website/). The post illustrates how to create a *CMS-free* blog by dynamically parsing markdown posts. Also it demonstrates how to utilise [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) so that posts can be pre-generated in production build.

## Configuration

This section shows an overview only, partly because I don't think my understanding of *webpack* is deep enough not to confuse readers. For details, please visit the [above mentioned post](https://css-tricks.com/the-rise-of-the-butt-less-website/). The app is built with the [webpack template](https://github.com/vuetifyjs/webpack) of [Vuetify](https://vuetifyjs.com) and the source can be found in my [GitHub repo](https://github.com/jaehyeon-kim/site).

### Adding *devDependencies*

The following packages are necessary in *devDependencies* and they are added as following.

```bash

yarn add -D prerender-spa-plugin markdown-with-front-matter-loader markdown-it highlight.js yaml-front-matter
```
*prerender-spa-plugin* is for pre-generating posts in production build and the others are necessary for parsing markdown header and content.

### Markdown parsing

For parsing markdown, it needs to update webpack base config file. Specifically `markdown-with-front-matter-loader` is added to `/build/webpack.base.conf.js`.

```js

module: {
    rules: [
        ...,
        {
            test: /\.md$/,
            loaders: ['markdown-with-front-matter-loader']
        } 
    ]
}
```

### Pre-rendering

The production config file of webpack is updated to include `prerender-spa-plugin` as shown below. In this setup, all markdown files in `/src/posts` will be pre-generated. The function `filesToRoutes` finds all files in a folder, removes extension and returns an array of routes with an optional route prefix.

```js

//
// /build/utils.js
//
exports.filesToRoutes = function (directory, extension, routePrefix = '') {
  function findFilesInDir(startPath, filter){
    let results = []
    if (!fs.existsSync(startPath)) {
      console.log("no dir ", startPath)
      return
    }
    const files = fs.readdirSync(startPath)
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i])
      const stat = fs.lstatSync(filename)
      if (stat.isDirectory()) {
        results = results.concat(findFilesInDir(filename, filter)) //recurse
      } else if (filename.indexOf(filter) >= 0) {
        results.push(filename)
      }
    }
    return results
  }

  return findFilesInDir(path.join(__dirname, directory), extension)
    .map((filename) => {
      return filename
        .replace(path.join(__dirname, directory), routePrefix)
        .replace(extension, '')
      })
}

//
// /build/webpack.prod.conf.js
//
...

const PrerenderSpaPlugin = require('prerender-spa-plugin')

...

    plugins: [
        new PrerenderSpaPlugin(
            // Path to compiled app
            path.join(__dirname, '../dist'),
            // List of endpoints you wish to prerender
            [ '/', 
            '/blog',
            ...utils.filesToRoutes('../src/posts', '.md', '/blog')
            ]
        ),
        ...
    ]

```

## App Setting

### Router

There are 3 routes and posts will be visited by *slug* as a prop. As shown below, a markdown file name excluding file extension is taken as a slug. For further details, see the next section.

```js

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:id',
    name: 'Article',
    props: true,
    component: Article,
  }
]

const router = new Router({
  mode: 'history',
  routes: routes  
})
```

### Update articles

State management is performed with [Vuex](https://vuex.vuejs.org/) and articles are updated by a mutation named `updateArticles` - it is committed when the app is created.

```js

const mutations = {
    updateArticles (state) {
        const posts = {}
        const articles = []
        const req = require.context('@/posts/', false, /\.md$/)
        req.keys().forEach((key) => {
            posts[key] = req(key)
        })
        Object.keys(posts).forEach((key) => {
            const article = posts[key]
            article.slug = key.replace('./', '').replace('.md', '')
            articles.push(article)
        })
        state.articles = articles
    },
    ...
}
```

[require.context](https://webpack.js.org/api/module-methods/#require-context) allows to specify a whole group of dependencies using a path to the directory with options indicating (1) whether to include subdirectory and (2) a regex filter to return files. Specifically for each markdown post, *yaml header* and *content* are parsed as an object - content is parsed into html. *slug* is created by excluding the path part and file extension. An example article object is shown below.

![](/static/2018-10-10-Create-Personal-Site-with-Vue/article.png)

With articles, blogs are listed as following.

![](/static/2018-10-10-Create-Personal-Site-with-Vue/blog-list.png)

### Code highlighting

My posts are likely to be technical and it's important that code snippets are well-readable. [Prism.js](https://prismjs.com/) is used for syntax highlighting as following.

```js

// /src/main.js

import 'prismjs'
import 'prismjs/themes/prism-coy.css'
import 'prismjs/components/prism-r'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-bash'

import VuePrism from 'vue-prism'
Vue.use(VuePrism)
```

![](/static/2018-10-10-Create-Personal-Site-with-Vue/code-highlight.png)

### Highcharts

Visualization is quite important for data products and [Highcharts](https://www.highcharts.com/) is my favourite charting library for its ease of use and [highcharter](http://jkunst.com/highcharter/) - R wrapper of Highcharts. To play with it, I added a word cloud chart that shows the frequency of tags of posts. 

![](/static/2018-10-10-Create-Personal-Site-with-Vue/wordcloud.png)

[Highcharts-Vue](https://github.com/highcharts/highcharts-vue) is used as a Vue plugin.

```js

// /src/main.js

import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import wordcloud from 'highcharts/modules/wordcloud'
import exportingInit from 'highcharts/modules/exporting'
exportingInit(Highcharts)
wordcloud(Highcharts)
Vue.use(HighchartsVue)
```

You may find in the above screen shot that, by selecting a tag, blogs are filtered. It took a while to figure out how to make it working and a way that I find is creating another Vue instance in the component where the chart is rendered. And adding a method of the instance to the chart's event.

```js

// /src/components/blog/BlogSide.vue

import Vue from 'vue';
import store from '@/store/index'

let vm = new Vue({
    ...,
    methods: {
        updateSelection (e) {
            store.commit('blog/updateSelection', {
                col: 'tags',
                val: e.name
            })
        }
    }
})

export default {
    ...
    computed: {
        ...,
        chartOptions () {
            return {
                series: [{
                    type: 'wordcloud',
                    data: this.tags,
                    name: 'Posts',
                    margin: 0,
                    padding: 0,                
                }],
                minPadding: 0,
                maxPadding: 0,
                title: { text: null },
                exporting: { enabled: false },
                credits: { enabled: true },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function () {
                                   vm.updateSelection(this)
                                }
                            }
                        }
                    }
                }
            }
        }        
    }
}
```

An overview of how this site is built is demonstrated in this post. To deploy, I've decided to use AWS (S3, CloudFront and Route53) - you can visit [my site](https://www.jaehyeon.me/). The deployment part will be illustrated in the next post.
