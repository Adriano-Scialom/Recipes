import Vue from 'vue';
import VueRouter from 'vue-router';
import Profil from '@/views/Profil.vue';
import Presentation from '../views/Presentation.vue';
import Recette from '../views/Recette.vue'
import Liste from '../views/Liste.vue';
import Oublie from '../views/Oublie.vue';
import Categories from '../views/Categories.vue'
import Murs from '../views/Murs.vue';
import Voir from '../views/Voir.vue';
import ListeCategorie from '../views/ListeCategorie.vue';
import Recents from '../views/Recents.vue';
import all from '../fb';

Vue.use(VueRouter)

  const routes = [
  
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
    path:'/recette/:id',
    name:'Recette',
    component:Recette
  },
  {
    path:'/mesrecettes',
    name:'ListeRecettes',
    component:Liste
  },
  {
    path:"/oublie",
    name:'MdpOublie',
    component:Oublie
  },
  {
    path:'/nouvelle',
    name:'Nouvelle',
    component:() => import('../views/Nouvelle.vue')
  },
  {
    path:'/modifier/:id',
    name:'Modification',
    component:() => import('../views/Nouvelle.vue')
  },
  {
    path:'/murs',
    name:'Murs',
    component:Murs
  },
  {
    path:'/voir/:id',
    name:'Voir',
    component:Voir
  },
  {
    path:'/piqueurderecette/:idpersonne/:idrecette',
    name:'Piqueur',
    component:Recette,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
  },
  {
    path:'/categories/:type',
    name: 'CategoriePrecise',
    component:ListeCategorie,
  },
  {
    path:'/',
    name:'Accueil',
    component:Recents,
  }
]
const scroll = (from, to, _)=>{
  console.log(from);
  console.log(to);
  console.log(_);
  return {x:0,y:0}}
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior:scroll
})
router.beforeEach((to,from,next)=>{
  if ((to.name!="Connexion" && to.name!="MdpOublie")&& !all.auth.currentUser){next('/connexion')}
  else{next()}
})
export default router;
