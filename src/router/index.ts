import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

// 扩展 RouteMeta 接口以获得更好的类型提示
declare module 'vue-router' {
    interface RouteMeta {
        name?: string;
        icon?: string;
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/Login/index.vue')
    },
    {
        path: '/',
        component: () => import("@/pages/Layout/index.vue"),
        redirect: "/home",
        children: [
            {
                path: "/home",
                component: () => import("@/pages/Home/index.vue"),
                meta: {
                    name: "首页"
                }
            },
            {
                path: '/class',
                meta: {
                    name: "班级学员管理"
                },
                children: [
                    {
                        path: '/class',
                        name: 'Class',
                        component: () => import("@/pages/classStudent/Class.vue"),
                        meta: {
                            name: "班级管理"
                        },
                    },
                    {
                        path: '/student',
                        name: 'Student',
                        component: () => import("@/pages/classStudent/Student.vue"),
                        meta: {
                            name: "学员管理"
                        },
                    }
                ]
            }, {
                path: '/dept',
                meta: {
                    name: "系统信息管理"
                },
                children: [
                    {
                        path: '/dept',
                        name: 'Dept',
                        component: () => import("@/pages/system/Dept.vue"),
                        meta: {
                            name: "部门管理"
                        },
                    },
                    {
                        path: '/emp',
                        name: 'Emp',
                        component: () => import("@/pages/system/Emp.vue"),
                        meta: {
                            name: "员工管理"
                        },
                    }
                ]
            }, {
                path: '/detReport',
                meta: {
                    name: "数据统计管理"
                },
                children: [
                    {
                        path: '/empReport',
                        name: 'EmpReport',
                        component: () => import("@/pages/report/EmpReport.vue"),
                        meta: {
                            name: "员工信息统计"
                        },
                    },
                    {
                        path: '/studentReport',
                        name: 'StudentReport',
                        component: () => import("@/pages/report/StudentReport.vue"),
                        meta: {
                            name: "学员信息统计"
                        },
                    },

                ]
            },
        ]
    },

];




const router = createRouter({
    history: createWebHashHistory(),
    routes
});


router.beforeEach((
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const token = localStorage.getItem('token');
    if (to.path !== '/login' && !token) {
        next('/login');
    } else {
        next();
    }
})

export default router;