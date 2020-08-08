import React from "react"
import Loadable from "react-loadable"
var Home = Loadable({
    loader: () => import("../App"),
    loading: () => <div>loading...</div>
})
var NotFound = Loadable({
    loader: () => import("../component/notfound"),
    loading: () => <div>loading...</div>
})
var Login = Loadable({
    loader: () => import("../component/login"),
    loading: () => <div>loading...</div>
})
var LoginLogs = Loadable({
    loader: () => import("../component/loginLogs"),
    loading: () => <div>loading...</div>
})
var PersonInfo = Loadable({
    loader: () => import("../component/PersonInfo"),
    loading: () => <div>loading...</div>
})
var UpUserInfo = Loadable({
    loader: () => import("../component/UpUserInfo"),
    loading: () => <div>loading...</div>
})
var UpUserPwd = Loadable({
    loader: () => import("../component/UpUserPwd"),
    loading: () => <div>loading...</div>
})
var Share = Loadable({
    loader: () => import("../component/Share"),
    loading: () => <div>loading...</div>
})
var AddShare = Loadable({
    loader: () => import("../component/AddShare"),
    loading: () => <div>loading...</div>
})
var SearchShare = Loadable({
    loader: () => import("../component/SearchShare"),
    loading: () => <div>loading...</div>
})
var Dev = Loadable({
    loader: () => import("../component/Dev"),
    loading: () => <div>loading...</div>
})
var ListDev = Loadable({
    loader: () => import("../component/ListDev"),
    loading: () => <div>loading...</div>
})
var UpdataDev = Loadable({
    loader: () => import("../component/UpdataDev"),
    loading: () => <div>loading...</div>
})
var OpaMyLogs = Loadable({
    loader: () => import("../component/OpaMyLogs"),
    loading: () => <div>loading...</div>
})
var OpaAllLogs = Loadable({
    loader: () => import("../component/OpaAllLogs"),
    loading: () => <div>loading...</div>
})
var Map = Loadable({
    loader: () => import("../component/Map"),
    loading: () => <div>loading...</div>
})
var Water = Loadable({
    loader: () => import("../component/Water"),
    loading: () => <div>loading...</div>
})

var AddAdmin = Loadable({
    loader: () => import("../component/AddAdmin"),
    loading: () => <h1 style={{ color: "red"}}>正在验证是否拥有权限</h1>
})
var DltDev = Loadable({
    loader: () => import("../component/DltDev"),
    loading: () => <h1 style={{ color: "red"}}>正在验证是否拥有权限</h1>
})
export const routes = [
    {
        path: "/home",
        component: Home
    },
    {
        path: "/404",
        component: NotFound
    },
    {
        path: "/login",
        component: Login
    }
]

//home路由下的子路由
export const homeRoutes=[
    {
        path:"/home/loginLogs",
        component:LoginLogs
    },
    {
        path:"/home/personInfo",
        component:PersonInfo
    },
    {
        path:"/home/upUserInfo",
        component: UpUserInfo
    },
    {
        path:"/home/upUserPwd",
        component: UpUserPwd
    },
    {
        path:"/home/share",
        component: Share
    },
    {
        path:"/home/addShare",
        component: AddShare
    },
    {
        path:"/home/searchShare",
        component: SearchShare
    },
    {
        path:"/home/dev",
        component: Dev
    },
    //设备列表
    {
        path:"/home/listDev",
        component: ListDev
    },
    //修改设备信息
    {
        path:"/home/updataDev/:devNum",
        component: UpdataDev
    },
    //个人操作日志
    {
        path:"/home/opaMyLogs",
        component: OpaMyLogs
    },
    //所有操作日志
    {
        path:"/home/opaAllLogs",
        component: OpaAllLogs
    },
    //地图
    {
        path:"/home/map/:location",
        component: Map
    },
    //水质
    {
        path:"/home/water",
        component: Water
    },
    //root权限--添加管理员
    {
        path:"/home/addAdmin",
        component: AddAdmin
    },
    //root权限--删除设备
    {
        path:"/home/dltDev",
        component: DltDev
    }
]
