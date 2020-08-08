import React, { Component } from 'react'
import { Table, Spin, Card, notification, Input,Button } from 'antd';
import { getAdminAllLogs, getAdminLogs } from "../../api/request"
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
const columns = [
    {
        title: '操作人员',
        dataIndex: 'admin',
    },
    {
        title: '操作内容',
        dataIndex: 'opa',
    },
    {
        title: '操作时间',
        dataIndex: 'cTime',
    },
];
export default class OpaAllLogs extends Component {
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
        getAdminAllLogs().then(res => {
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
        let data={page}
        //判断管理员姓名的input是否有值,如果有,进行携带name进行查询  否则不携带
        if (this.tt.state.value){
            data.name = this.tt.state.value
        }
        // console.log(data,"-------");
        getAdminLogs(data).then(res => {
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
    //搜索管理员日志
    searchAdminLogs(value){
        //设置分页器页码
        getAdminAllLogs({ name: this.tt.state.value}).then(res => {
            if (res.data.state) {
                //数据获取成功
                this.setState({
                    pagetotal: res.data.data.length
                })
            } else {
                //数据获取出错,请稍后再试
                this.openNotificationWithIcon('error', "数据获取出错,请稍后再试")
            }
        })
        //获取初始数据(第一页,默认十条,所以不设置)
        this.getDatePage(1)
    }
    //搜索回车事件
    searchAdmin=(e)=>{
        this.searchAdminLogs(e.target.value)
    }
    //
    buttonSearch=()=>{
        this.searchAdminLogs(this.tt.state.value)
    }
    render() {
        let { data, pagetotal, sping } = this.state
        return (
            <div>
                <Spin spinning={sping}>
                    <Card>
                        <Input placeholder="请输入管理员姓名进行搜索" style={{ width: "250px" }} prefix={<UserOutlined />} onPressEnter={this.searchAdmin} ref={node=>this.tt=node} />
                        <Button type="primary" onClick={this.buttonSearch} icon={<SearchOutlined />}>搜素日志</Button>
                        <Card hoverable={true} title="详细信息" >
                            <Table columns={columns} bordered dataSource={data} size="small" pagination={{ total: pagetotal, onChange: this.changePage }} />
                        </Card></Card>
                </Spin>
            </div>
        )
    }
}
