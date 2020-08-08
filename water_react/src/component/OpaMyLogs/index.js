import React, { Component } from 'react'
import { Table, Spin, Card, notification } from 'antd';
import { getAdminAllLogs, getAdminLogs } from "../../api/request"
const columns = [
    {
        title: '操作内容',
        dataIndex: 'opa',
    },
    {
        title: '操作时间',
        dataIndex: 'cTime',
    },
];
export default class OpaMyLogs extends Component {
    constructor() {
        super()
        this.state = {
            pagetotal: 10,
            data: [],
            sping: false
        }
    }
    componentDidMount() {
        //设置分页器页码
        getAdminAllLogs({ name: sessionStorage.getItem("name") }).then(res => {
            if (res.data.state) {
                //数据获取成功
                this.setState({
                    pagetotal: res.data.data.length
                })
            } else {
                //数据获取出错,请稍后再试
                this.openNotificationWithIcon('error', "数据获取出错,请稍后再试")
            }
        }).catch(err => {
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        })
        //获取初始数据(第一页,默认十条,所以不设置)
        this.getDatePage(1)
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    //获取数据(分页)
    getDatePage(page) {
        //开启加载
        this.setState({
            sping: true
        })
        getAdminLogs({ name: sessionStorage.getItem("name"), page }).then(res => {
            if (res.data.state) {
                //数据获取成功
                this.setState({
                    data: res.data.data.map(item => {
                        return {
                            key: item._id,
                            admin: item.admin,
                            opa: item.opa,
                            cTime: item.cTime
                        }
                    })
                })
            } else {
                //数据获取失败,尝试一下刷新页面吧!
                this.openNotificationWithIcon('error', "数据获取失败,尝试一下刷新页面吧!")
            }
        }).catch(err => {
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        }).finally(() => {
            //关闭加载
            this.setState({
                sping: false
            })
        })
    }
    //页码改变
    changePage = (page) => {
        this.getDatePage(page)
    }
    render() {
        let { data, pagetotal, sping } = this.state
        return (
            <div>
                <Spin spinning={sping}>
                    <Card hoverable={true} title="详细信息" extra={<div><span>操作人员:</span><span style={{ color: "red",marginLeft:"10px",fontWeight:"900" }}>{sessionStorage.getItem("name")}</span></div>}>
                        <Table columns={columns} bordered dataSource={data} size="small" pagination={{ total: pagetotal, onChange: this.changePage }} />
                    </Card>
                </Spin>
            </div>
        )
    }
}
