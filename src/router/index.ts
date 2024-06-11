// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router';
import { useStore } from '../store';
const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('../view/Index.vue'),
    },
    {
        path: '/report',
        name: 'report',
        component: () => import('../view/Report.vue'),
    },
    {
        path: '/correct',
        name: 'correct',
        component: () => import('../view/Correct.vue'),
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, form, next) => {
    const store = useStore();
    next()
})

export default router
