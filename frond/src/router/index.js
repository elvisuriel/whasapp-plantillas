import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/connect', component: () => import('../views/ConnectView.vue') },
  { path: '/templates', component: () => import('../views/TemplatesView.vue') },
  { path: '/lists', component: () => import('../views/ListsView.vue') },
  { path: '/campaigns', component: () => import('../views/CampaignsView.vue') },
  { path: '/history', component: () => import('../views/HistoryView.vue') },
  { path: '/send', component: () => import('../views/SendView.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
