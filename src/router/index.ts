import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

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
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/table/:name',
    name: 'Table',
    component: () => import(/* webpackChunkName: 'table' */'@/views/Columns.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

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

export default router
