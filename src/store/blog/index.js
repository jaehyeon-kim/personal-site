const state = {
    articles: []
}

const getters = {
    articles (state) {
        return state.articles
    },
    dateToString () {
        return str => {
            let d = new Date(str)
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            return d.toLocaleDateString('en-US', options)
        }
    }
}

// https://webpack.js.org/api/module-methods/#require-context
// require.context() method accepts three arguments.
// * the directory where it will search
// * whether or not to include subdirectories
// * a regex filter to return files
const mutations = {
    updateArticles (state) {
        const posts = {}
        const articles = []
        const req = require.context('@/posts/', false, /\.md$/)
        req.keys().forEach((key) => {
            posts[key] = req(key)
        })
        // console.log(posts)
        Object.keys(posts).forEach((key) => {
            const article = posts[key]
            article.slug = key.replace('./', '').replace('.md', '')
            articles.push(article)
        })
        // console.log(articles)
        state.articles = articles
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}