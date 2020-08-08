import React, { Component } from 'react'
import { Form, Input, Button, DatePicker, Switch, Spin, Select, notification } from 'antd';
import { addDev } from "../../api/request"
export default class Dev extends Component {
    constructor(){
        super()
        this.state={
            sping:false
        }
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    onfinish = (value) => {
        // 开启加载
        this.setState({
            sping:true
        })
        let flag = true
        let { devName, devNum, devDate, devSIM = "", devUse = false,devLocation = "", devAdmin = "" } = value;
        // console.log({ devName, devNum, devDate, devSIM, devUse, devLocation, devAdmin });
        // console.log(devDate._d);
        if (devLocation.split(",").length !== 2 && devLocation !== "") {
            flag = false
            // 设备位置要求用英文逗号分隔或为空
            this.setState({
                sping: false
            })
            this.openNotificationWithIcon('error', "设备位置要求为空或者用英文逗号隔开")
        }
        if (flag) {
            //表格数据验证通过
            let query = { devName, devNum, devDate: devDate._d, devSIM, devUse, devLocation: devLocation.split(","), devAdmin }
            addDev(query).then(res => {
                console.log(res);
                if (res.data.state) {
                    //设备添加成功
                    this.openNotificationWithIcon('success', "设备添加成功")
                } else if(res.data.status===0&&res.data.msg==="设备已注册"){
                    //设备已注册
                    this.openNotificationWithIcon('error', "添加失败,设备已注册")
                }else{
                    this.openNotificationWithIcon('error', "添加失败,请检查参数")
                }
            }).catch(err => {
                //网络出错
                this.openNotificationWithIcon('error', "网络1错误")
            }).finally(()=>{
                // 关闭加载
                this.setState({
                    sping: false
                })
            })
        }
    };
    render() {
        return (
            <div>
                <Spin spinning={this.state.sping}>
                    <Form
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 14,
                        }}
                        layout="horizontal"
                        onFinish={this.onfinish}
                        size="middle"
                    >
                        
                        <Form.Item label="设备名称" name="devName"
                            rules={[{ required: true, message: '设备名称必填' }]}>
                            <Select>
                                <Select.Option value="pH检测仪">pH检测仪</Select.Option>
                                <Select.Option value="浑浊度检测仪">浑浊度检测仪</Select.Option>
                                <Select.Option value="溶解氧检测仪">溶解氧检测仪</Select.Option>
                                <Select.Option value="水温检测仪">水温检测仪</Select.Option>
                                <Select.Option value="电导率检测仪">电导率检测仪</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="设备编号" name="devNum"
                            rules={[{ required: true, message: '设备编号必填!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="设备生产日期" name="devDate"
                            rules={[{ required: true, message: '设备生产日期必填!' }]}>
                            <DatePicker placeholder="请选择生产日期" />
                        </Form.Item>
                        <Form.Item label="SIM卡号" name="devSIM">
                            <Input />
                        </Form.Item>
                        <Form.Item label="是否正在使用" valuePropName='checked' name="devUse">
                            <Switch />
                        </Form.Item>
                        <Form.Item label="设备位置" name="devLocation">
                            <Input placeholder="经纬度之间用英文逗号分隔" />
                        </Form.Item>
                        <Form.Item label="维护人员" name="devAdmin">
                            <Input />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 16, offset: 8 },
                            }}
                        >
                            <Button type="primary" htmlType="submit">添加</Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        )
    }
}
