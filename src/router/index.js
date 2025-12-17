import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/talents',
      name: 'talents',
      component: () => import('../views/TalentView.vue'),
    },
    {
      path: '/allocate',
      name: 'allocate',
      component: () => import('../views/AllocateView.vue'),
    },
    {
      path: '/life',
      name: 'life',
      component: () => import('../views/LifeView.vue'),
    },
    {
      path: '/summary',
      name: 'summary',
      component: () => import('../views/SummaryView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
