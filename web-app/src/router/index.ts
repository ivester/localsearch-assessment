import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      // TODO make home route with search query - if it's defined then instantly search for that query and prefill the search input
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/detail/:id',
        name: 'Detail',
        // TODO make comment: I think I route guard works great for this demo but for real life I would try some other approach since the page change could be slow if the internet is slow, which would be a bad UX - One way to improve that would be to load all detail information in the background of all the shown search result (or even send that info with search respond) - so by the time the user clicks on a search result, the data should be loaded. For this scenario a store like Pinia could be helpful. Another option would be to jump right away to the detail view and show a loading indicator until the data is loaded. A further option would be to show a loading indicator on the clicked search card and expand it once the extra details have been loaded. Or some combination of all these options.
        // beforeEnter: async (to, from, next) => {
        //   try {
        //     // const business = await fetchBusinessDetail(to.params.id)
        //     // Add the business detail to the route params
        //     // to.params.business = business
        //     to.params.business = {business: 'business'}
        //     next()
        //   } catch (error) {
        //     // Handle the error
        //     console.error(error)
        //     next('/')
        //   }
        // },
        component: () => import('@/views/Detail.vue'),
      },
    ],
  },
]

// TODO make fallback - invalid route to redirect to home
// TODO if detail route ID does not return any result then show warning message

const router = createRouter({
  // TODO what is history - can I remove it?
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
