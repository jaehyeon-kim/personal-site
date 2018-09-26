const state = {
    articles: [],
    // savedOffset: 0
}

const getters = {
    articles (state) {
        return state.articles
    },
    // savedOffset (state) {
    //     return state.savedOffset
    // }
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
    },
    // updateSavedOffset (state, offset) {
    //     state.savedOffset = offset
    // }
}

const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}