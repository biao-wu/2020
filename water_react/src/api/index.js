import axios from "axios"

var service=axios.create({
    baseURL:"/api",
    "content-type":"application/json",
    timeout:5000
})
service.interceptors.request.use((config)=>{
    if(sessionStorage.getItem("token")){
        config.headers["authorization"]=sessionStorage.getItem("token")
    }
    return config;
})
service.interceptors.response.use(res=>{
    if (res.data.status === 0 && res.data.msg === "校验失败"){        
        sessionStorage.removeItem("name")
        sessionStorage.clear()
        window.location.href="/login"
    }
    return res    
})
export default service