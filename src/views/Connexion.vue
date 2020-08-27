<template>
    <v-container class="ma-5">
      <h1 class="primary--text">Connexion</h1>
      <v-container class="ma-5">
      <v-layout row justify-space-around wrap>
        <v-flex  xs12 md6 >
          <v-text-field label="Adresse email" :rules="emailRules" v-model="mail"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row justify-space-around wrap>
        <v-flex  xs12 md6 >
          <v-text-field label="Mot de passe" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            counter
            @click:append="show = !show" :rules="mdpRules" v-model="motdepasse" ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row justify-space-around wrap>
        <v-flex  xs2 md1 >
          <v-btn router to="/presentation"><v-icon left>login</v-icon>
          <div>Connexion</div></v-btn>
        </v-flex>
      </v-layout>
      </v-container>
    </v-container>
 
</template>

<script>
export default {
  data(){
    return {
      show:false,
      emailRules: [
        v => !!v || 'E-mail requit',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      mdpRules:[
        v=> !!v || 'Mot de passe requit',
        v=> v.length>6 || 'Mot de passe trop court'
      ],
      mail:"",
      motdepasse:""
      }
  },
  methods:{
    connexion(){}
  }
}
</script>

<style scoped>
.body{
  background-color: green;
}
</style>