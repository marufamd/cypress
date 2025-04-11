import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ReportView from '@/views/ReportView.vue';
import ReportsView from '@/views/ReportsView.vue';
import CreateReportView from '@/views/CreateReportView.vue';
import { supabase } from '@/util/supabase';

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
    path: '/reports/create',
    name: 'Submit Report',
    component: CreateReportView,
    meta: {
      hidden: true,
      auth: true
    }
  },
  {
    path: '/reports/:id',
    name: 'ReportView',
    component: ReportView,
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    component: LoginView,
    meta: {
      hidden: true
    }
  },
  {
    path: '/register',
    component: RegisterView,
    meta: {
      hidden: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: navItems,
});

router.beforeEach(async (to, _, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const requiresAuth = to.meta.auth

  if (requiresAuth && !session) {
    next('/login')
  } else {
    next()
  }
})

export default router;
