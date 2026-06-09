import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Room from '@/views/Room.vue';
import Register from '@/views/Register.vue';
import Welcome from '@/views/Welcome.vue';
import LogIn from '@/views/LogIn.vue';
import authGuard from './authGuard';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'welcome', component: Welcome },
  { path: '/login', name: 'login', component: LogIn },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home, beforeEnter: authGuard },
  { path: '/room/:id', name: 'room', props: true, component: Room, beforeEnter: authGuard },
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
