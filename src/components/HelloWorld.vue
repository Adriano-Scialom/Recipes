<template>
  <v-container>
      <div class="ma-5"></div>
      <div v-for="user in users" :key="user.nom">{{user.nom}}</div>

  </v-container>
</template>

<script>
import db from "@/fb";

  export default {
    name: 'HelloWorld',
    computed:{
      users(){
        
        return this.$store.state.users;
      }
    },
    data: () => ({
    }),
    created(){
        db.collection('users').get().then((data)=>{
        var users = [];
        data.forEach(user => {
          users.push(user.data());
        });
        this.$store.commit('setUsers',users);
        });
        
        //return users; 
    }
    
  }
</script>
