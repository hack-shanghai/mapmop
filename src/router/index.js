import Vue from 'vue';
import Router from 'vue-router';

import Home from '../pages/Home';
import Board from '../pages/Board';

Vue.use(Router);

const router = new Router({
  base: __dirname,
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/board',
      name: 'Board',
      component: Board,
    },
  ],
});

export default router;

