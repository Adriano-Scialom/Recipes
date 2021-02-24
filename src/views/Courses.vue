<template>
    <v-container>
        <v-card>
            <v-card-title :class="[color+'--text']">Liste de course</v-card-title>
            <v-card-actions class="pb-0"><v-spacer></v-spacer><v-btn class="mr-3 red--text" @click="()=>{liste=[];miseAJour();}" text>Vider liste</v-btn><v-btn text @click="()=>{updating = !updating; if(!updating){miseAJour()}}">{{updating ? "Finir modifications":"Modifier liste"}}</v-btn></v-card-actions>
            <v-card-text class="pt-0">
                <v-list>
                    <div v-if="!updating">
                    <v-list-item dense v-for="ingredient in liste" :key="ingredient.id">
                        <v-list-item-icon><v-icon @click="suppress(ingredient)">delete</v-icon></v-list-item-icon>
                        <v-list-item-title>{{nom(ingredient)}}</v-list-item-title>
                    </v-list-item>
                    </div>
                    <div v-else>
                        <v-list-item v-for="ingredient in liste" :key="ingredient.id">
                            <v-layout row justify-space-around class="mx-0">
                                <v-flex xs3 md2 class="px-1">
                                    <v-text-field v-model="ingredient.qte" type="number" label="Quantité"></v-text-field>
                                </v-flex>
                                <v-flex xs3 md2 class="px-1">
                                    <v-text-field v-model="ingredient.unite" label="Unité"></v-text-field>
                                </v-flex>
                                <v-flex xs6 md7 class="px-1">
                                    <v-text-field v-model="ingredient.nom" label="Nom"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-list-item>
                    </div>
                    <v-list-item>
                        <v-layout row justify-space-around class="mx-0">
                                <v-flex xs3 md2 class="px-1">
                                    <v-text-field v-model="nouveau.qte" type="number" label="Quantité"></v-text-field>
                                </v-flex>
                                <v-flex xs3 md2 class="px-1">
                                    <v-text-field v-model="nouveau.unite" label="Unité"></v-text-field>
                                </v-flex>
                                <v-flex xs5 md7 class="px-1">
                                    <v-text-field v-model="nouveau.nom" label="Nom"></v-text-field>
                                </v-flex>
                                <v-flex xs1 md1 justify-self-end>
                                    <v-btn icon class="mt-3 ml-4"><v-icon @click="ajouterNouveau">add</v-icon></v-btn>
                                </v-flex>
                            </v-layout>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import all from '../fb';
const {db,auth} = all;
export default {
    data(){
        return {
            liste:[],
            updating:false,
            nouveau:{nom:"",id:Math.round(Math.random()*1000)}
            }
    },
    computed:{
        color(){return this.$store.getters.color},
    },
    methods:{
        miseAJour(){
            db.collection("users").doc(auth.currentUser.uid)
        .collection("listes").doc("liste").update({liste:this.liste});
        },
        suppress(ingredient){
            let index = this.liste.findIndex(el=>el==ingredient);
            if(index>=0){this.liste.splice(index,1);}
            this.miseAJour();
        },
        nom(ingredient){
            let result = "";
            if(ingredient.qte && ingredient.qte > 0){
                result+=ingredient.qte+" "
            }
            if(ingredient.unite && ingredient.unite.length>0){
                result+=ingredient.unite
                result+= 'aeiouh'.includes(ingredient.nom[0].toLowerCase()) ? " d'": ' de '}
            result+= ingredient.nom;
            return result;
        },
        ajouterNouveau(){
            this.$set(this.liste,this.liste.length,this.nouveau);
            this.nouveau = {nom:'',id:Math.round(Math.random()*1000)}
        },
    },
    created(){
        db.collection("users").doc(auth.currentUser.uid)
        .collection("listes").doc("liste").get()
        .then(snap=>{
            let data = snap.data();
            if(data)
                this.liste = data.liste || [];
        })
    }
}
</script>