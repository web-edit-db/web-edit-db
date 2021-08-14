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
    component: () => import('@/views/Tables.vue'),
    children: [
      {
        path: 'data',
        name: 'TableData',
        meta: {
          title: () => `Table - ${router.currentRoute.value.params.name} - Data`
        },
        component: () => import('@/views/Data.vue'),
        props: true
      },
      {
        path: 'columns',
        name: 'TableColumns',
        meta: {
          title: () => `Table - ${router.currentRoute.value.params.name} - Columns`
        },
        component: () => import('@/views/Columns.vue'),
        props: true
      }
    ]
  }
]

if (import.meta.env.DEV) {
  routes.push({
    path: '/ks',
    name: 'KitchenSink',
    component: () => import('@/views/KitchenSink.vue')
  })
}

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

router.beforeEach((to, from, next) => {
  if (to.name?.toString().startsWith('Table')) {
    // handle Table routes (Table, TableColumns, TableData)
    if (!((to.params.name as string) in store.state.modifications)) {
      // if the user went to a table that doesn't exist
      // send the user home
      next('/')
    } else
    if (to.name === 'Table') {
      next({
        ...to,
        name: (from.name !== 'Table' && from.name?.toString().startsWith('Table')) ? from.name : 'TableColumns'
      })
    } else {
      next()
    }
  } else {
    next()
  }
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
