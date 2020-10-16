<template>
    <v-menu offset-y bottom open-on-hover close-on-content-click>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :color="color"
          dark
          v-bind="attrs"
          v-on="on"
          icon
          class="mt-3"
        >
          <v-icon>expand_more</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="supprimer">
          <v-list-item-title><v-icon small left>close</v-icon> Supprimer</v-list-item-title>
        </v-list-item>
        <v-list-item @click="monter">
          <v-list-item-title><v-icon small left>expand_less</v-icon> Monter</v-list-item-title>
        </v-list-item>
        <v-list-item @click="baisser">
          <v-list-item-title><v-icon small left>expand_more</v-icon> Baisser</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>

<script>
export default {
    props:['supprimer','monter','baisser'],
    computed:{
      color(){return this.$store.getters.color},
    }
}
</script>