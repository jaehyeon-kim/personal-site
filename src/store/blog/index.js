const state = {
    articles: [],
    selection: {
        col: null,
        val: null,
    }
}

const getters = {
    articles (state) {
        return state.articles
    },
    selection (state) {
        return state.selection
    },
    dateToString () {
        return str => {
            let d = new Date(str)
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            return d.toLocaleDateString('en-US', options)
        }
    },
    dist (state) {
        return col => {
            let elems = []
            let dist = []
            state.articles.map(x => x[col]).forEach(x => {
                elems = elems.concat(x)
            })
            let uniqueElems = [...new Set(elems)]
            uniqueElems.forEach(u => {
                dist.push({ name: u, weight: elems.filter(x => x === u).length })
            })
            return dist
        }
    },
    selected (state) {
        let col = state.selection.col
        let val = state.selection.val
        if (col && val) {
            let selc = []
            if (col === 'category') {
                selc = state.articles.filter(x => x.category === val)
            } else {
                selc = state.articles.filter(x => x.tags.includes(val))
            }

            return selc.sort((a, b) => {
                if (a.created > b.created) return -1
                if (a.created < b.created) return 1
                return 0
              })
        } else {
            return state.articles.sort((a, b) => {
                if (a.created > b.created) return -1
                if (a.created < b.created) return 1
                return 0
              })
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
    },
    updateSelection (state, payload) {
        state.selection = payload
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