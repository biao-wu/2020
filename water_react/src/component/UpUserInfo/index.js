import React, { Component } from 'react'
import { getAdminInfo, updataInfo } from "../../api/request"
import { Button, Spin, notification   } from 'antd';
import "./upUserInfo.css"
export default class UpUserInfo extends Component {
    constructor() {
        super()
        this.state = {
            name: "",
            nickname: "",
            phone: "",
            email: "",
            des: ""
        }
    }
    componentDidMount() {
        getAdminInfo(sessionStorage.getItem("name")).then(res => {
            console.log(res);
            if (res.data.state) {
                this.setState({
                    name: res.data.findResult[0].name,
                    nickname: res.data.findResult[0].nickname,
                    phone: res.data.findResult[0].phone,
                    email: res.data.findResult[0].email,
                    des: res.data.findResult[0].des || "",
                    sping: false
                })
            }
        })
    }
    change(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    //通知框
    openNotificationWithIcon = (type,msg) => {
        notification[type]({
            message: msg
        });
    };
    onSure = () => {
        this.setState({
            sping: true
        })
        let flag = true
        let { name, nickname, phone, email, des } = this.state
        if (phone) {
            if (!(/^1[3456789]\d{9}$/.test(phone))) {
                this.openNotificationWithIcon('error', "手机号码有误，请重填")
                flag = false
            }
        }
        if (email) {
            if (!(/^[\da-z]+([\-\.\_]?[\da-z]+)*@[\da-z]+([\-\.]?[\da-z]+)*(\.[a-z]{2,})+$/.test(email))) {
                /*邮箱首字符和末尾字符必须为字母或数字，邮箱名可以全是字母或数字，或者是两者的组合；
                连字符 " - " 、下划线 " _ “和英文句号点”."，仅能放在字母或数字中间，且不能连续出现（即其单个符号的左右只能是字母或数字）；
                域名可以带连字符"-"， 域名可以带连字符"-"，且可以是多级域名 ,还可以有多个域名后缀；
                不区分大小写；
                不限定邮箱字符串的具体长度。 */
                this.openNotificationWithIcon('error', "邮箱有误，请重填")
                flag = false
            }
        }
        if (flag) {
            //发送修改得请求
            let _id = sessionStorage.getItem("_id")
            updataInfo({ _id, name, nickname, phone, email, des })
                .then(res => {
                    console.log(res);
                    if (res.data.state) {
                        //修改成功
                        this.openNotificationWithIcon('success',"修改成功")
                    } else {
                        //信息相同,无需修改
                        this.openNotificationWithIcon('success', "信息相同,无需修改")
                    }
                }).catch(res => {
                    //token失效
                    this.openNotificationWithIcon('error', "网络错误")
                }).finally(() => {
                    this.setState({
                        sping: false
                    })
                })
        }else{
            this.setState({
                sping: false
            })
        }
    }
    render() {
        let { name, nickname, phone, email, des,sping } = this.state
        return (
            <div className="userInfo">
                <div>
                    <h4>姓名:</h4>
                    <input type="text" id="name" value={name} onChange={this.change.bind(this)} />
                </div>
                <div>
                    <h4>昵称:</h4>
                    <input type="text" id="nickname" value={nickname} onChange={this.change.bind(this)} />
                </div>
                <div>
                    <h4>电话:</h4>
                    <input type="text" id="phone" value={phone} onChange={this.change.bind(this)} />
                </div>
                <div>
                    <h4>邮箱:</h4>
                    <input type="email" id="email" value={email} onChange={this.change.bind(this)} />
                </div>
                <div>
                    <h4>个性签名:</h4>
                    <textarea value={des} id="des" onChange={this.change.bind(this)} />
                </div>
                <Spin spinning={sping}>
                    <Button type="primary" shape="round" onClick={this.onSure}>确认更改</Button>
                </Spin>
            </div>
        )
    }
}
