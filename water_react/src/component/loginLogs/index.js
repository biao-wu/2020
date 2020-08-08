import React, { Component } from 'react'
import { Table, notification} from 'antd';
import { getLogs, getAllLogs} from "../../api/request"
const columns = [
    {
        title: '登入账户',
        dataIndex: 'admin',
    },
    {
        title: 'IP',
        dataIndex: 'IP',
    },
    {
        title: '登入时间',
        dataIndex: 'nowTime',
    },
    {
        title: '上次登入时间',
        dataIndex: 'preTime',
    }
];

export default class LoginLogs extends Component {
    constructor(props){
        super(props)
        this.state={
            data :[],
            pagetotal:100
        }
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    componentDidMount(){
        this.getLogsPage()
        getAllLogs(sessionStorage.getItem("name")).then(res=>{
            if(res.data.state){
                this.setState({
                    pagetotal: res.data.data.length
                })
            }else{
                this.openNotificationWithIcon('error', "token失效")
                // window.location.href = "/login"
            }
        })
        .catch(res=>{
            this.openNotificationWithIcon('error', "网络错误")
            window.location.href = "/login"
            document.addEventListener("click", event => {
                var cDom = document.querySelector("#filter-header");
                var tDom = event.target;
                if (cDom == tDom || cDom.contains(tDom)) {
                  // ... 
                } else {
                  cDom.style.display = "none"
                }
              });
        })
    }
    changePage=(page,pageSize)=>{
        this.getLogsPage(page, pageSize)
        console.log(page)
    }
    getLogsPage = (page, count)=>{
        getLogs(sessionStorage.getItem("name"),page,count).then(res => {
            console.log(page,count)
           if(res.data.state){
               //数据获取成功
               let data = res.data.data.map(item => {
                   return {
                       key: item._id,
                       admin: item.username,
                       IP: item.nowLogin.ip,
                       nowTime: item.nowLogin.loginTime,
                       preTime: item.lastLogin.loginTime
                   }
               })
               this.setState({
                   data
               })
           }else{
               this.openNotificationWithIcon('error', "token失效")
           }
        })
        .catch(err=>{
            this.openNotificationWithIcon('error', "网络错误")
        })
    }
    render() {
        let { data, pagetotal}=this.state
        // console.log(this.state)
        // console.log(pagetotal)
        // console.log(this.changePage)
        return (
            <div>
                <Table columns={columns} dataSource={data} size="middle" pagination={{ total: pagetotal, onChange:this.changePage}} />
            </div>
        )
    }
}
