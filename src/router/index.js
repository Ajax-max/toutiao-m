import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'login',
    component: () => import("../views/login/index")
  },
  {
    path: '/',
    component: () => import("../views/layout/index"),
    children:[
      {
        path:'', //首页(默认子路由)
        name:'home',
        component: () => import("../views/home/index")
      },
      {
        path:'/qa',
        name:'qa',
        component: () => import("../views/qa/index")
      },
      {
        path:'/video',
        name:'video',
        component: () => import("../views/video/index")
      },
      {
        path:'/my',
        name:'my',
        component: () => import("../views/my/index")
      }
    ]
  },
  {
    path: '/search',
    name:'search',
    component:() => import('../views/search')
  },
  {
    path:'/article/:articleId',
    name:'article',
    component:() => import('../views/article'),
    props:true
  },
  {
    path:'/user/profile',
    name:"user-profile",
    component:() => import("../views/user-profile")
  }
]

const router = new VueRouter({
  routes
})

export default router
