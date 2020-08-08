import axios from "./index.js"

//登录
export const login =(name,pwd)=>axios({
    method:"post",
    url:"/users/login",
    data: { name, pwd}
})

//获取登录日志
export const getLogs=(name,page,count)=>axios({
    url:"/getlogs",
    params: { name, page, count}
})

//获取所有(单个人)登录日志
export const getAllLogs = (name) => axios({
    url: "/getlogs/all",
    params: { name}
})

//获取管理员基本信息
export const getAdminInfo=(name)=>axios({
    url: "/users/find",
    params: { name }
})

//修改个人基本信息
export const updataInfo=(data)=>axios({
    method: "post",
    url:"/users/updata",
    data
})

//修改个人密码
export const updataPwd=(data)=>axios({
    method: "post",
    url:"/users/uppwd",
    data
})

//上传头像
export const up=(file)=>axios({
    method:"post",
    url:"/share/upload",
    data:file
})

//添加共享信息
export const addShare = (data) => axios({
    method: "post",
    url: "/share/add",
    data
})

//查询共享信息(分页)
export const findSharePage = (data) => axios({
    method: "post",
    url: "/share/contentpage",
    data
})

//查询共享信息(不分页,全部信息)
export const findShareAll = (name) => axios({
    method: "post",
    url: "/share/contentall",
    data:{
        name
    }
})

//添加设备信息
export const addDev = (data) => axios({
    method: "post",
    url: "/dev/adddev",
    data
})

//获取设备信息(分页)
export const getDevList=(data)=>axios({
    method:"post",
    url:"/dev/finddev",
    data
})

//获取设备信息   总数
export const getAllDevList=()=>axios({
    method:"post",
    url:"/dev/findalldev"
})

//修改设备信息 
export const updataDev = (data)=>axios({
    method:"post",
    url:"/dev/updatedev",
    data
})

//获取管理员操作日志 (分页) name可传可不传
export const getAdminLogs = (params)=>axios({
    url:"/adminlogs",
    params
})

//获取管理员操作日志 全部 name可传可不传
export const getAdminAllLogs = (data)=>axios({
    method: "post",
    url:"/adminlogs/all",
    data
})

//获取水质信息  mySQL
export const getWater = () => axios({
    url: "/aliyun",
})


//root账户  添加账户
export const addAdmin = (data)=>axios({
    method: "post",
    url: "/users/regist",
    data
})

//root账户  删除设备
export const delDev = (devNum)=>axios({
    method: "post",
    url: "/dev/dltdev",
    data: { devNum}
})