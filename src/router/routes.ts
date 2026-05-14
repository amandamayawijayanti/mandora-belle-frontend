import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
  path: '/shop',
  name: 'shop',
  component: () => import('../views/ShopView.vue')
  },
  {
  path: '/category',
  name: 'category',
  component: () => import('../views/CategoryView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/user/:id',
    name: 'user-detail',
    component: () => import('../views/UserDetail.vue'),
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue')
  }
{
  path: '/login',
  name: 'login',
  component: () => import('../views/LoginView.vue'),
},
{
  path: '/register',
  name: 'register',
  component: () => import('../views/RegisterView.vue'),
},
]

export default routes
