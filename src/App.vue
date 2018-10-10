<template>
  <v-app>
    <v-toolbar color="indigo accent-2" dark app dense scroll-off-screen :scroll-threshold="threshold">
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer;">Jaehyeon Kim</router-link>        
      </v-toolbar-title>
      <div class="ml-4 mt-1">
        <a class="white--text" target="_blank" href="https://www.linkedin.com/in/jaehyeon-kim-76b93429/">
          <i class="fa fa-linkedin-square mr-1" style="font-size:20px"></i>
        </a>
        <a class="white--text" target="_blank" href="https://github.com/jaehyeon-kim">
          <i class="fa fa-github ml-1 mr-1" style="font-size:20px"></i>
        </a>
        <a class="white--text" href="mailto:dottami@gmail.com">
          <i class="fa fa-envelope-o ml-1" style="font-size:20px"></i>
        </a>        
      </div>      
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat small v-for="(item, i) in items" :key="i" :to=item.link exact>
          <v-icon size="18" class="mr-1">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn flat small @click="open">          
          old blog
          <v-icon dark size="10" class="mb-2">open_in_new</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="hidden-md-and-up">
        <v-menu>
          <v-toolbar-title slot="activator">
            <v-icon size="20" dark large>menu</v-icon>
          </v-toolbar-title>
          <v-list>
            <v-list-tile v-for="(item, i) in items" :key="i" :to=item.link exact>
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="open">
              <v-list-tile-action>
                <v-icon>open_in_new</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>old blog</v-list-tile-title>
              </v-list-tile-content>              
            </v-list-tile>
          </v-list>       
        </v-menu>
      </v-toolbar-items>      
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <!-- <v-footer color="indigo accent-2" dark :fixed="fixed" app>
      <span>&copy; 2018 Jaehyeon Kim</span>
    </v-footer> -->
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
