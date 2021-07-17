import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/About.vue')
  },
  {
    path: '/table/:name',
    name: 'Table',
    component: () => import('@/views/Columns.vue'),
    meta: {
      title: () => `Table - ${router.currentRoute.value.params.name}`
    },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// prevent the user from accidentally leaving the site on backspace key
let backspacePressed = false

window.addEventListener('keydown', (event) => (backspacePressed = event.key === 'Backspace'))
window.addEventListener('keyup', () => (backspacePressed = false))

router.beforeEach((_to, _from, next) => {
  if (backspacePressed) {
    // backspace navigation so prevent
    next(false)
  } else {
    next()
  }
  backspacePressed = false
})

// page title control
router.afterEach((to) => {
  const titleParts = []
  if (store.state.database) titleParts.push(store.state.database.name)
  const titleMeta = (typeof to.meta.title === 'function' ? to.meta.title() : to.meta.title)
  titleParts.push(titleMeta || to.name)
  document.title = `${titleParts.join(' / ')} - Web Edit DB`
})

export default router
