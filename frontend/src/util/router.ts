import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ReportView from '@/views/ReportView.vue';
import ReportsView from '@/views/ReportsView.vue';

export const navItems = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/MapView.vue')
  },
  {
    path: '/reports/:id',
    name: 'ReportView',
    component: ReportView,
  },
  {
    path: '/login',
    component: LoginView,
  },
  {
    path: '/register',
    component: RegisterView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: navItems,
});

export default router;
