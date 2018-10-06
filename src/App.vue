<template>
  <v-app>
    <v-toolbar dark app dense scroll-off-screen :scroll-threshold="threshold">
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer;">Jaehyeon Kim</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat small v-for="(item, i) in items" :key="i" :to=item.link exact>
          <v-icon size="18" class="mr-1">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn flat small @click="open">
          <v-icon size="16" class="mr-1">open_in_new</v-icon>
          old blog
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer dark :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      fixed: false,
      threshold: 100,
      items: [
        { icon: 'reorder', title: 'Blog', link: '/blog' },
      ]
    }
  },
  methods: {
    open () {
      window.open('http://jaehyeon-kim.github.io/', '_blank')
    }
  },
  created() {
    this.$store.commit('blog/updateArticles')
  }  
}
</script>
