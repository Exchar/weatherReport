import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router";
// @ts-ignore
import NProgress from "nprogress";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "",
    meta: {
      keepAlive: true,
    },
    component: () => import("../components/Layout.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        meta: {
          keepAlive: true,
        },
        component: () => import("../views/home/index.vue"),
      },
    ],
  },
    {
    path: "/today",
    name: "",
    meta: {
      keepAlive: true,
    },
    component: () => import("../components/Layout.vue"),
    redirect: "/today",
    children: [
      {
        path: "/today",
        name: "Today",
        meta: {
          keepAlive: true,
        },
        component: () => import("../views/miniWeather/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(), // 哈希值模式
  routes,
});

router.beforeEach((to, from, next) => {
  NProgress.start(); // 进度条开始
  next();
});

router.afterEach(() => {
  NProgress.done(); // 进度条结束
});

// 暴露出去
export default router;
