import React, { Component } from 'react'
import { updataPwd } from "../../api/request"
import { Button, Spin, notification } from 'antd';
import "../UpUserInfo/upUserInfo.css"
export default class UpUserInfo extends Component {
    constructor() {
        super()
        this.state = {
            pwd: "",
            newPwd: "",
            newPwd2: "",
            sping: false
        }
    }
    change(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    onSure = () => {
        //开启加载
        this.setState({
            sping: true
        })
        let {pwd,newPwd,newPwd2}=this.state
        let flag = true
        if (newPwd === newPwd2){
            if (!(/^\d{6,}$/.test(newPwd))) {
                this.openNotificationWithIcon('error', "密码最少六位")
                flag = false;
            }
        }else{
            //两次密码不一致,请查正后再试
            this.openNotificationWithIcon('error', "两次密码不一致,请查正后再试")
            flag = false;
        }
        if (flag) {
            //发送修改得请求
            let _id = sessionStorage.getItem("_id")
            updataPwd({_id,pwd,newpwd:newPwd}).then(res=>{
                console.log(res);
                if(res.data.state){
                    //密码修改成功
                    this.openNotificationWithIcon('success', "密码修改成功")
                    this.props.history.push("/login")
                    this.openNotificationWithIcon('success', "请重新登录")
                }else if(res.data.msg="密码错误"){
                    //密码错误
                    this.openNotificationWithIcon('error', "原密码错误")
                }
            }).catch(res=>{
                //token失效
                this.openNotificationWithIcon('error', "网络错误")
            }).finally(()=>{
                this.setState({
                    sping: false
                })
            })
        } else {
            this.setState({
                sping: false
            })
        }
    }
    render() {
        let { pwd, newPwd, newPwd2, sping } = this.state
        console.log(this.props);
        
        return (
            <div className="userInfo">
                <div>
                    <h4>旧密码:</h4>
                    <input type="password" id="pwd" value={pwd} onChange={this.change.bind(this)} />
                </div>
                <div>
                    <h4>新密码:</h4>
                    <input type="password" id="newPwd" value={newPwd} onChange={this.change.bind(this)} />
                </div>
                <div>
                    <h4>请再此输入新密码:</h4>
                    <input type="password" id="newPwd2" value={newPwd2} onChange={this.change.bind(this)} />
                </div>
                <br />
                <Spin spinning={sping}>
                    <Button type="primary" shape="round" onClick={this.onSure}>确认修改密码</Button>
                </Spin>
            </div>
        )
    }
}
