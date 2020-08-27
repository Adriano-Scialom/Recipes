<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        
        <img
          
          class="shrink mr-2"
          contain
          src="./assets/toque.png"
          transition="scale-transition"
          width="40"
          @click="toggle"
        />

        <span  @click="to_presentation"><span class="text-md-h5 text-xs-subtitle-1"> Ricetta AlluScia</span><span class="subtitle">.whatakif</span></span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <Drawer/>    
    
    <v-main class="grey lighten-2">
      <router-view></router-view>
    </v-main> 
  </v-app>
</template>

<script>
import Drawer from '@/components/Navbar.vue'

export default {
  name: 'App',

  components: {
    Drawer
  },

  data: () => ({
    //
  }),
  methods:{
    toggle(){
      this.$store.commit("toggle_drawer")
    },
    to_presentation(){
      this.$router.push("/presentation")
    }
  }
};
</script>
