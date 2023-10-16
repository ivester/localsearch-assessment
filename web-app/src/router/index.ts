import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
      },
      {
        path: '/detail/:id',
        name: 'Detail',
        component: () => import('@/views/Detail.vue'),
      },
    ],
  },
  // redirect to home if route does not exist
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  // Using HTML 5 history mode so I don't have to use hash in the URL
  // https://router.vuejs.org/guide/essentials/history-mode.html#HTML5-Mode
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
