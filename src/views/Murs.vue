<template>
    <v-container>
        <v-layout justify-space-between row wrap>
            <v-flex xs12 md4 v-for="personne in personnes" :key="personne.id">
                <v-card class="ma-2">
                    
                    <v-card-title class="info--text text-capitalize">{{personne.nom}} {{personne.prenom}}</v-card-title>
                    <v-img v-if="personne.imageURL" aspect-ratio="1.3" :src="personne.imageURL"></v-img>
                    <v-card-actions><v-btn text color="blue" router :to="personne.id==auth.currentUser.uid ? '/mesrecettes' : `/voir/${personne.id}`">Accéder aux recettes</v-btn></v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import all from '../fb';
const auth = all.auth;
const db = all.db;
import firebase from 'firebase/app';
import 'firebase/storage';
export default {
    data(){
        return {auth}
    },
    computed:{
        personnes(){
            return this.$store.state.personnes;
        }
    },
    created(){
            db.collection("users").get().then((snap)=>{
                snap.forEach((res)=>{
                    let personne = res.data();
                    personne.id = res.id;
                    
                    this.$store.commit("addModifyPerson",personne)
                    if(!personne.imageURL && personne.image){
                    firebase.storage().ref(personne.image).getDownloadURL().then(result=>{
                        personne.imageURL = result;
                        this.$store.commit("addModifyPerson",personne)
                        this.$forceUpdate();
                    })}
                });
            })
        
    },
}
</script>