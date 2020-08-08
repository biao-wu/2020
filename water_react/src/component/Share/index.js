import React, { Component } from 'react'
import { List, Avatar, Card, Pagination, notification } from 'antd';
import { findSharePage, findShareAll } from "../../api/request"
export default class Share extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            total: 10
        }
    }
    //通知框
    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };
    componentDidMount() {
        //获取总数(页码)
        findShareAll().then(res=>{
            if (res.data.state) {
                console.log(res.data.data.length)
                this.setState({
                    total: res.data.data.length/5*10
                })
            } else {
                //页码获取出错,请刷新页面再试!
                this.openNotificationWithIcon('error', "页码获取出错,请刷新页面再试!")
            }
        }).catch(err=>{
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        })
        //获取信息
        findSharePage({ page: 1, count: 5 }).then(res => {
            if (res.data.state) {
                this.setState({
                    data: res.data.data
                })
            } else {
                //数据获取出错,请刷新页面再试!
                this.openNotificationWithIcon('error', "数据获取出错,请刷新页面再试!")
            }
        }).catch(err => {
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        })
    }
    //页数发生变化
    changePage = (page)=>{
        findSharePage({ page,count: 5 }).then(res => {
            if (res.data.state) {
                this.setState({
                    data: res.data.data
                })
            } else {
                //数据获取出错,请刷新页面再试!
                this.openNotificationWithIcon('error', "数据获取出错,请刷新页面再试!")
            }
        }).catch(err => {
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        })
    }
    render() {
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (
                        <Card extra={"创建时间:" + item.cTime} style={{marginBottom:"10px"}}>
                            <List.Item>
                                <List.Item.Meta
                                    size="large"
                                    avatar={<Avatar src={item.imgSrc} />}
                                    title={<a href="#">{item.shareName}</a>}
                                    description={item.contents}
                                />
                            </List.Item>
                        </Card>
                    )}
                />
                <br />
                <Pagination defaultCurrent={1} total={this.state.total} onChange={this.changePage} />
            </div>
        )
    }
}
