import React, { Component } from 'react'
import { Descriptions, notification} from 'antd';
import { getAdminInfo } from "../../api/request"
export default class PersonInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    componentDidMount() {
        getAdminInfo(sessionStorage.getItem("name")).then(res => {
            if (res.data.state) {
                this.setState({
                    data: res.data.findResult[0]
                })
            }else{
                this.openNotificationWithIcon('error', "token失效")
            }
        })
            .catch(err => {
                this.openNotificationWithIcon('error', "网络错误")
            })
    }
    editDes=()=>{
        window.location.href = "/home/upUserInfo"
    }
    render() {
        let { name, phone, email, nickname, des } = this.state.data
        return (
            <div>
                <Descriptions
                    title="管理员基本信息"
                    bordered
                    column="2"
                >
                    <Descriptions.Item label="姓名">{name}</Descriptions.Item>
                    <Descriptions.Item label="昵称">{nickname}</Descriptions.Item>
                    <br />
                    <Descriptions.Item label="电话">{phone}</Descriptions.Item>
                    <Descriptions.Item label="邮箱">{email}</Descriptions.Item>
                    <br />
                    <Descriptions.Item label="个性签名">
                        {
                            des ? des : "暂无内容!您可以书写您得个性签名,让更多人认识你!"
                        }
                        <br/>
                        <a onClick={this.editDes}>点击此处去书写</a>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }
}
