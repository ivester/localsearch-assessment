import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
]

const router = createRouter({
  // TODO what is history - can I remove it?
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
