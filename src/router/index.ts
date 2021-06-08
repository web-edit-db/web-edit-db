import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Column from '../views/Columns.vue'
import { useTables } from '@/database'

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
    component: Column,
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

router.beforeEach((to, _from, next) => {
  const { list } = useTables()
  if (backspacePressed) {
    // backspace navigation so prevent
    next(false)
  } else if (to.name === 'Table' && !list.value.includes(to.params.name as string)) {
    // sent to table that doesn't exist anymore
    next('/')
  } else {
    next()
  }
  backspacePressed = false
})

export default router
