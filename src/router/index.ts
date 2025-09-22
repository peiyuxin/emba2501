import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/simple.vue'),
        meta: {
          title: '首页',
          icon: 'House'
        }
      },
      {
        path: '/courses',
        name: 'Courses',
        component: () => import('@/views/courses/index.vue'),
        meta: {
          title: '课程中心',
          icon: 'Reading'
        }
      },
      {
        path: '/students',
        name: 'Students',
        component: () => import('@/views/students/index.vue'),
        meta: {
          title: '同学录',
          icon: 'User'
        }
      },
      {
        path: '/activities',
        name: 'Activities',
        component: () => import('@/views/activities/index.vue'),
        meta: {
          title: '班级活动',
          icon: 'Calendar'
        }
      },
      {
        path: '/forum',
        name: 'Forum',
        component: () => import('@/views/forum/index.vue'),
        meta: {
          title: '讨论论坛',
          icon: 'ChatDotSquare'
        }
      },
      {
        path: '/resources',
        name: 'Resources',
        component: () => import('@/views/resources/index.vue'),
        meta: {
          title: '学习资源',
          icon: 'Folder'
        }
      },
      {
        path: '/gallery',
        name: 'Gallery',
        component: () => import('@/views/gallery/index.vue'),
        meta: {
          title: '班级相册',
          icon: 'Picture'
        }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'UserFilled'
        }
      }
    ]
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test/index.vue'),
    meta: {
      title: '测试页面',
      hiddenSidebar: true
    }
  },
  {
    path: '/group-lottery-simple',
    name: 'GroupLotterySimple',
    component: () => import('@/views/group-lottery-simple/index.vue'),
    meta: {
      title: '分组抽签(简化版)',
      hiddenSidebar: true
    }
  },
  {
    path: '/group-lottery',
    name: 'GroupLottery',
    component: () => import('@/views/group-lottery/index.vue'),
    meta: {
      title: '分组抽签',
      hiddenSidebar: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hiddenSidebar: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '页面未找到',
      hiddenSidebar: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 人民大学EMBA2501班` : '人民大学EMBA2501班'
  next()
})

export default router
