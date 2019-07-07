import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/layout/Layout.vue';

Vue.use(Router)

export default new Router({
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
      redirect: 'notafiscal',
      children: [
        {
          path: 'notafiscal',
          name: 'NotaFiscal',
          component: () => import('@/views/notafiscal.vue')
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
