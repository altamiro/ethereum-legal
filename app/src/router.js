import Vue from 'vue'
import Router from 'vue-router'
import auth from './authService'

// import auth from "./authService";
import Layout from '@/views/layout/Layout.vue';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/401', component: () => import('@/views/erro/401.vue'), },
    { path: '/404', component: () => import('@/views/erro/404.vue'), },
    { path: '*', redirect: '/404' },
    // {
    //   path: '',
    //   component: Layout,
    //   redirect: 'dashboard',
    //   children: [
    //     {
    //       path: 'dashboard',
    //       name: 'Dashboard',
    //       component: () => import('@/views/dashboard.vue')
    //     },
    //   ],
    // },
    {
      path: '',
      component: Layout,
      redirect: 'lancamento',
      children: [
        {
          path: 'lancamento',
          name: 'Lancamento',
          component: () => import('@/views/lancamento.vue')
        },
      ],
    },
    // {
    //   path: '/nota-fiscal',
    //   component: Layout,
    //   children: [
    //     {
    //       path: '/nota-fiscal',
    //       name: 'notafiscal',
    //       component: () => import('@/views/notafiscal.vue'),
    //     },
    //   ],
    // },
    {
      path: '/login',
      component: () => import('@/views/login.vue'),
    },
    {
      path: '/registrar',
      component: () => import('@/views/registrar.vue'),
    },
  ]
})

const whiteList = ['/login', '/registrar']// no redirect whitelist

router.beforeEach((to, from, next) => {

  if (auth.isAuthenticated()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next();
    } // end iF
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
    } // end iF
  } // end iF  
})

export default router