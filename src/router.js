import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router'

// 创建路由
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/home',
            component: () => import('./views/textImage.vue')
        }
    ]
})

// 导出路由
export default router
