<template>
    <nav>
    <v-navigation-drawer app v-bind:value="sortie" class="blue lighten-3">
        <v-list>
            <v-list-item v-for="link in links" :key="link.text" router :to="link.route" color="blue">
                <v-list-tile-action>
                    <v-icon class="white--text">{{ link.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <span> </span>
                    <v-list-tile-title class="white--text ml-3"> {{ link.text }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer> 
    </nav>
</template>

<script>
export default {
    data(){
        return {

            links:[{text:"Profil", route:"/profil", icon:"person"},
                    {text:"Catégories",route:"/categories",icon:"category"},
                    {text:"Discussions", route:"/discussions", icon:"groups"},
                    
                    ]
        }
    },
    computed:{
        sortie(){
            return this.$store.state.drawer_sortie
        }
    }
}
</script>