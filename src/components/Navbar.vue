<template>
    <nav>
    <v-navigation-drawer app v-bind:value="sortie" :color="color" class="">
        <v-list>
            <v-list-item v-for="link in links" :key="link.text" router :to="link.route" @click="clique_lien(link.route)" :color="color">
                <v-list-item-action>
                    <v-icon class="white--text">{{ link.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <span> </span>
                    <v-list-item-title class="white--text ml-3"> {{ link.text }}</v-list-item-title>
                </v-list-item-content>
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
                    {text:"Nouvelle recette",route:'/nouvelle',icon:'plus_one'},
                    {text:"Mes recettes",route:"/mesrecettes",icon:"food_bank"},
                    {text:'Cuisiniers',route:'/murs',icon:'people'},
                    ],
            
        }
    },
    computed:{
        sortie(){
            return this.$store.state.drawer_sortie
        },
        color(){return this.$store.getters.color},
    },
    methods:{
        clique_lien(lien){
            this.$store.commit('toggle_drawer');
            this.$router.push(lien);
        }
    }
}
</script>