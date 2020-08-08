import React, { Component } from 'react'
import { List, Avatar, Card, Pagination, notification,Button } from 'antd';
import { findSharePage, findShareAll } from "../../api/request"
import { SearchOutlined } from '@ant-design/icons';
import "./SearchShare.css"
export default class SearchShare extends Component {
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
    //页数发生变化
    changePage = (page) => {
        findSharePage({ page, count: 5 }).then(res => {
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
    search=()=>{
        console.log(this.node.value);
        //获取总数(页码)
        findShareAll(this.node.value).then(res => {
            if (res.data.state) {
                if (res.data.data.length===0){
                    this.openNotificationWithIcon('info', "查询完毕,该作者下无数据")
                }
                this.setState({
                    total: res.data.data.length / 5 * 10
                })
            } else {
                //页码获取出错,请刷新页面再试!
                this.openNotificationWithIcon('error', "页码获取出错,请刷新页面再试!")
            }
        }).catch(err => {
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        })
        //获取信息
        findSharePage({ shareName: this.node.value,page: 1, count: 5 }).then(res => {
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
                <input type="text" ref={(node)=>this.node=node} className="searchInput"/>
                <Button type="primary" shape="circle" onClick={this.search} icon={<SearchOutlined />} />
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (
                        <Card extra={"创建时间:" + item.cTime} style={{ marginBottom: "10px" }}>
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
                <Pagination defaultCurrent={1} total={this.state.total} hideOnSinglePage={true} onChange={this.changePage} />
            </div>
        )
    }
}
