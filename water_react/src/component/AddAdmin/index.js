import React, { Component } from 'react'
import { addAdmin} from "../../api/request"
import { withRouter } from "react-router-dom";
import { Form, Input, Button, Card, notification, Spin } from 'antd';
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 6,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 4,
        span: 16,
    },
};
   


@withRouter 
class AddAdmin extends Component {
    constructor(){
        super()
        this.state={
            sping:false
        }
    }
    onFinish = values => {
        console.log(values);
        this.setState({
            sping:true
        })
        addAdmin(values).then(res=>{
            if(res.data.state){
                //添加成功
                this.openNotificationWithIcon('success', "管理员新增成功")
            } else if (res.data.msg ==="没有该权限(注册用户)"){
                //非法登录
                this.openNotificationWithIcon('error', "非法登录!!!!")
                sessionStorage.clear()
                this.props.history.push("/login")
            }else{
                //添加失败,请稍后再试
                this.openNotificationWithIcon('error', "添加失败,请稍后再试!")
            }
        }).catch(()=>{
            //网络错误
            console.log("网络");
            
            this.openNotificationWithIcon('error', "网络错误")
        }).finally(()=>{
            this.setState({
                sping: false
            })
        })
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    render() {
        return (
            <Spin spinning={this.state.sping}>
                <div>
                    <Card title="添加管理员">
                        <Form
                            {...layout}
                            name="basic"
                            onFinish={this.onFinish}
                        >
                            <Form.Item
                                label="管理员账户"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: '必须输入管理员账号!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="pwd"
                                rules={[
                                    {
                                        required: true,
                                        message: '必须输入密码!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">添加</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </Spin>
        )
    }
}
export default AddAdmin