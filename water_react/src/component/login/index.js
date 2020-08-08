import React, { Component } from 'react'
//粒子组件
import ReactCanvasNest from 'react-canvas-nest';
import "./login.css"
import { Form, Input, Button, Checkbox, Row, Col, notification } from 'antd';
import {login} from "../../api/request"

//Form的组件布局
const layout = {
    labelCol: { span: 8},
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default class Login extends Component {
    onFinish = values => {
        login(values.name,values.pwd).then(res=>{
           if(res.data.status===1){
               //登录成功
               this.openNotificationWithIcon('success', "登录成功")
               sessionStorage.setItem("token", res.data.token)
               sessionStorage.setItem("_id", res.data._id)
               sessionStorage.setItem("name", values.name)
               window.location.href = "/home"
           }else{
               this.openNotificationWithIcon('error', "账号或者密码错误")
           }
        })
    };
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    render() {
        return (
            <div className="allScroll">
                <ReactCanvasNest className='canvasNest' config={{ pointColor: ' 255, 255, 255 ', lineColor: "255,255,255", count: 98 }} style={{ zIndex: 0 }} />
                <Row>
                    <Col span={12} offset={8}>
                        <Form
                            {...layout}
                            name="basic"
                            layout="horizontal"
                            initialValues={{ remember: true }}
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                        >
                            <Form.Item
                                label="用户名"
                                name="name"
                                rules={[{ required: true, message: '请输入用户名!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="pwd"
                                rules={[{ required: true, message: '请输入用户密码!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item {...tailLayout} name="remember" valuePropName="checked" >
                                <Checkbox style={{"color":"white"}}>记住密码</Checkbox>
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">登录</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                
            </div>
        )
    }
}
