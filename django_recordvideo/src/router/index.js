import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Record from "../views/Record.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/record",
    name: "Record",
    component: Record,
  },
  {
    path: "/:catchAll(.*)",
    name: "PageNotFound",
    component: () => import('../views/PageNotFound.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
