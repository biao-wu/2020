import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { List, Card, Pagination, notification, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getDevList, getAllDevList, delDev } from "../../api/request"
import "../ListDev/ListDev.css"
@withRouter
class DltDev extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            total: ""
        }
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    componentDidMount() {
        this.getDevData()//初始获取信息,默认第一页  五条数据
        getAllDevList().then(res => {
            if (res.data.state) {
                //获取所有数据成功  设置分页数量
                this.setState({
                    total: res.data.data.length / 5 * 10
                })
            } else {
                //数据获取失败,请稍后再试
                this.openNotificationWithIcon('error', "数据获取失败,请稍后再试!")
            }
        }).catch(err => {
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        })
    }
    getDevData(query = {}) {
        getDevList(query).then(res => {
            if (res.data.state) {
                //查询成功
                let data = res.data.findResult.map(item => {
                    return {
                        devName: item.devName,
                        devNum: item.devNum,
                        devDate: item.devDate,
                        devSIM: item.devSIM,
                        devUse: item.devUse,
                        devAdmin: item.devAdmin,
                        cTime: item.cTime,
                        devLocation: item.devLocation.join(",")
                    }
                })
                this.setState({
                    data
                })
            } else {
                //数据查询失败,请刷新页面再试
                this.openNotificationWithIcon('error', "数据获取失败,请稍后再试!")
            }
        }).catch(err => {
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        })
    }
    //分页
    changePage = (page) => {
        this.getDevData({ page })
    }
    //删除的点击事件
    aclick(item) {
        Modal.confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined />,
            content: "您将要删设备除编号为" +item.devNum+"的"+item.devName,
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                delDev(item.devNum).then(res=>{
                    console.log(res);
                    if(res.data.state){
                        //设备删除成功
                        this.openNotificationWithIcon('success', item.devName+"删除成功")
                    } else if (res.data.msg === "没有该权限(删除设备)"){//未来完成------
                        //没有该权限(删除设备)
                        this.openNotificationWithIcon('error', "非法登录!!!!")
                        sessionStorage.clear()
                        this.props.history.push("/login")
                    } else {
                        //删除失败,请稍后再试
                        this.openNotificationWithIcon('error', "删除失败,请稍后再试!")
                    }
                }).catch(err=>{
                    //网络错误
                    this.openNotificationWithIcon('error', "网络错误")
                })
            }
        });
    }
    //地图
    goMap(location, name) {
        console.log(location);
        console.log(this.props);
        this.props.history.push("/home/map/" + location + "&" + name)
    }
    render() {
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item>
                            <Card title={<div><span style={{ marginRight: "15px" }}>设备编号:{item.devNum}</span><span>设备名称:{item.devName}</span></div>} extra={<Button type="primary" danger onClick={this.aclick.bind(this, item)}>删除</Button>} style={{ width: "100%" }} >
                                <List.Item.Meta
                                    description={
                                        <div className="devListStyle">
                                            <p><span>生产日期:</span>{item.devDate}</p>
                                            <p><span>SIM卡号:</span>{item.devSIM}</p>
                                            <p><span>使用状态:</span>{item.devUse ? "正在使用中" : "暂停使用"}</p>
                                            <div className="locationStyle"><span>所处位置:</span>{item.devUse ? item.devLocation ? <div>[{item.devLocation}]<a onClick={this.goMap.bind(this, item.devLocation, item.devName)}>点击查看</a></div> : "暂时未录入位置" : "暂停使用,无位置记录"}</div>
                                            <p><span>维护人员:</span>{item.devAdmin}</p>
                                            <p><span>设备添加时间:</span>{item.cTime}</p>
                                        </div>
                                    }
                                />
                            </Card>
                        </List.Item>
                    )}
                />
                <Pagination defaultCurrent={1} total={this.state.total} onChange={this.changePage} />
            </div>
        )
    }
}
export default DltDev