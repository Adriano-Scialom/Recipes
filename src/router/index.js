import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profil from '@/views/Profil.vue'
import Presentation from '../views/Presentation.vue'
import Recette from '../views/Recette.vue'
import Liste from '../views/Liste.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/connexion',
    name: 'Connexion',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Connexion.vue')
  },
  {
    path:'/profil',
    name:'Profil',
    component:Profil
  },
  {
    path:'/presentation',
    name:'Presentation',
    component:Presentation  
  },
  {
    path:'/recette',
    name:'Recette',
    component:Recette
  },
  {
    path:'/mesrecettes',
    name:'ListeRecettes',
    component:Liste
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
