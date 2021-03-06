import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import UserProfile from '../components/UserProfile.vue'
import CreateGroup from '../components/CreateGroup.vue'
import UserProfile1 from '../components/UserProfile1.vue'
import TesteChat from '../components/TesteChat.vue'
import Friends from '../components/Friends.vue'
import store from '../store/modules/token';
import Utilizadores from '../components/Utilizadores.vue'
import Dummy from '../components/Dummy.vue'
import Groups from '../components/Groups.vue'
import Register from '../components/Register.vue'
import CriarEvento from '../components/CriarEvento.vue'
import Eventos from '../components/Eventos.vue'
import GroupProfile from '../components/GroupProfile.vue'


Vue.use(VueRouter)


// função para as rotas protegidas! basicamente so verifica se tem o token. temos que progredir para validar o token porque pode ja tar expirado
const isAuthenticated = (to, from, next) => {
  if (store.state.token != null) {
    next()
    return
  }
  next('/')
}


const routes = [

  
  {
    path: '/home',
    name: 'home',
    component: Home,
    beforeEnter: isAuthenticated
  },
  {
    path: '/criarEvento',
    name: 'criarevento',
    component: CriarEvento,
    beforeEnter: isAuthenticated
  },
  {
    path: '/eventos',
    name: 'eventos',
    component: Eventos,
    beforeEnter: isAuthenticated
  },
  {
    path: '/testing',
    name: 'testing',
    component: UserProfile1,
    beforeEnter: isAuthenticated
  },
  {
    path: '/grouprofile',
    name: 'groupprofile',
    component: GroupProfile,
    beforeEnter: isAuthenticated
  },
  {
    path: '/createGroup',
    name: 'createGroup',
    component: CreateGroup,
    beforeEnter: isAuthenticated
  },
  {
    path: '/groups',
    name: 'groups',
    component: Groups,
    beforeEnter: isAuthenticated
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/addpost',
    name: 'addpost',
    component: Dummy,
    beforeEnter: isAuthenticated
  },
  {
    path: '/users',
    name: 'users',
    component: Utilizadores,
    beforeEnter: isAuthenticated
  },
  {
    path: '/friends',
    name: 'friends',
    component: Friends,
    beforeEnter: isAuthenticated
  },
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'profile',
    beforeEnter: isAuthenticated,
    component: UserProfile
  },
  {
    path: '/chat',
    name: 'chat',
    component: TesteChat,
    beforeEnter: isAuthenticated
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter: isAuthenticated
  }
]

const router = new VueRouter({
  routes
})

export default router
