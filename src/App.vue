<template>
  <v-app>
    <v-toolbar dark app dense>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer;">Jaehyeon Kim</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat small v-for="(item, i) in items" :key="i" :to=item.link exact>
          <v-icon size="18" class="mr-1">{{ item.icon }}</v-icon>
          {{ item.title }}
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
      items: [
        { icon: 'reorder', title: 'Blog', link: '/blog' },
      ]
    }
  }
}
</script>
