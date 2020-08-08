import React, { Component } from 'react'
import { Button, Switch, Spin, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import "../UpUserInfo/upUserInfo.css"
import { getDevList, updataDev } from "../../api/request"
export default class Dev extends Component {
    constructor(props) {
        super(props)
        this.state = {
            devNum: props.match.params.devNum,
            devSIM: "",
            devLocation: "",
            devAdmin: "",
            devUse: true,
            sping: false
        }
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    change(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    //使用状态
    changeDevUse=()=>{
        this.setState({
            devUse:!this.state.devUse
        })
    }
    componentDidMount() {
        let devNum = this.props.match.params.devNum
        if (devNum !== "请输入设备编号进行修改设备信息") {
            this.getDevInfo(devNum)
        }
    }
    searchDev = () => {
        this.getDevInfo(this.state.devNum)
    }
    //获取设备基本信息
    getDevInfo(devNum) {
        //开启加载
        this.setState({
            sping: true
        })
        if (!devNum) {
            this.openNotificationWithIcon('error', "设备编号必填")
            this.setState({
                sping: false
            })
            return;
        }
        getDevList({ devNum }).then(res => {
            if (res.data.state && res.data.findResult.length !== 0) {
                //获取设备信息成功
                this.setState({
                    devSIM: res.data.findResult[0].devSIM,
                    devLocation: res.data.findResult[0].devLocation.join(",") || "",
                    devAdmin: res.data.findResult[0].devAdmin,
                    devUse: res.data.findResult[0].devUse,
                })
            } else {
                //无此设备
                this.openNotificationWithIcon('error', "无此设备")
                this.setState({
                    devSIM: "",
                    devLocation: "",
                    devAdmin: ""
                })
            }
        }).catch(err => {
            this.openNotificationWithIcon('error', "网络错误")
        }).finally(() => {
            this.setState({
                sping: false
            })
        })
    }
    onSure = (value) => {
        // 开启加载
        this.setState({
            sping: true
        })
        let flag = true
        let { devNum, devSIM = "", devUse, devLocation = "", devAdmin = "" } = this.state;
        if (!devNum) {
            flag = false
            this.openNotificationWithIcon('error', "设备编号必填")
            this.setState({
                sping: false
            })
            return;
        }
        if (devLocation.split(",").length !== 2 && devLocation !== "") {
            flag = false
            // 设备位置要求用英文逗号分隔或为空
            this.setState({
                sping: false
            })
            this.openNotificationWithIcon('error', "设备位置要求为空或者用英文逗号隔开")
            return;
        }
        if (flag) {
            //表单验证通过
            getDevList({ devNum }).then(res => {
                if (res.data.state && res.data.findResult.length !== 0) {
                    //获取设备信息成功
                    let data = { devNum, devSIM, devUse, devLocation: devLocation.split(","), devAdmin }
                    updataDev(data).then(res => {
                        if (res.data.state) {
                            //设备更新成功
                            this.openNotificationWithIcon('success', "设备更新成功")
                        } else if (res.data.msg === "设备信息一致,更新失败") {
                            this.openNotificationWithIcon('success', "设备信息一致,无需更新")
                        } else {
                            this.openNotificationWithIcon('error', "更新失败,请稍后再试!")
                        }
                    }).catch(err => {
                        this.openNotificationWithIcon('error', "网络错误")
                    }).finally(() => {
                        // 关闭加载
                        this.setState({
                            sping: false
                        })
                    })
                } else {
                    //无此设备
                    this.openNotificationWithIcon('error', "无此设备")
                    this.setState({
                        devSIM: "",
                        devLocation: "",
                        devAdmin: "",
                        sping: false
                    })
                }
            }).catch(err => {
                this.openNotificationWithIcon('error', "网络错误")
            }).finally(() => {
                // 关闭加载
                this.setState({
                    sping: false
                })
            })
        }
    };
    render() {
        let { devNum, devSIM, devLocation, devAdmin, devUse, sping } = this.state
        return (
            <div className="userInfo">
                <div>
                    <h4>设备编号:</h4>
                    <input type="text" id="devNum" value={devNum} onChange={this.change.bind(this)} />
                    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={this.searchDev} />
                </div>
                <div>
                    <h4>SIM卡号:</h4>
                    <input type="text" id="devSIM" value={devSIM} onChange={this.change.bind(this)} />
                </div>
                <div>
                    <h4>使用状态:</h4>
                    {/* <Switch defaultChecked onChange={this.onUse} /> */}
                    <div>{devUse ? <h4 style={{ color: "green" }}>正在使用</h4> : <h4 style={{ color: "red" }}>暂停使用</h4>}</div>
                    <button onClick={this.changeDevUse}>{devUse ? "停止" : "开启"}</button>
                </div>
                <div>
                    <h4>位置:</h4>
                    <input type="text" id="devLocation" value={devLocation} onChange={this.change.bind(this)} />
                </div>
                <div>
                    <h4>维护人员:</h4>
                    <input type="text" value={devAdmin} id="devAdmin" onChange={this.change.bind(this)} />
                </div>
                <br />
                <Spin spinning={sping}>
                    <Button type="primary" shape="round" onClick={this.onSure}>确认更改</Button>
                </Spin>
            </div>
        )
    }
}
