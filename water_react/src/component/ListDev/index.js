import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { List, Card, Pagination, notification } from 'antd';
import { getDevList, getAllDevList} from "../../api/request"
import "./ListDev.css"
@withRouter
class ListDev extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            total:""
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
        getAllDevList().then(res=>{
            if(res.data.state){
                //获取所有数据成功  设置分页数量
                this.setState({
                    total:res.data.findResult.length/5*10
                })
            }else{
                //数据获取失败,请稍后再试
                this.openNotificationWithIcon('error', "数据获取失败,请稍后再试!")
            }
        }).catch(err=>{
            //网络错误
            this.openNotificationWithIcon('error', "分页错误")
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
            }else{
                //数据查询失败,请刷新页面再试
                this.openNotificationWithIcon('error', "数据获取失败,请稍后再试!")
            }
        }).catch(err=>{
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        })
    }
    //分页
    changePage=(page)=>{
        this.getDevData({page})
    }
    //修改点击事件
    aclick(devNum){
        this.props.history.push("/home/updataDev/"+devNum)
    }
    //地图
    goMap(location,name){
        console.log(location);
        console.log(this.props);
        this.props.history.push("/home/map/"+location+"&"+name)
    }
    render() {
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item>
                            <Card title={<div><span style={{marginRight:"15px"}}>设备编号:{item.devNum}</span><span>设备名称:{item.devName}</span></div>} extra={<a onClick={this.aclick.bind(this,item.devNum)}>修改</a>} style={{ width: "100%" }} >
                                <List.Item.Meta
                                    description={
                                        <div className="devListStyle">
                                            <p><span>生产日期:</span>{item.devDate}</p>
                                            <p><span>SIM卡号:</span>{item.devSIM}</p>
                                            <p><span>使用状态:</span>{item.devUse ? "正在使用中" : "暂停使用"}</p>
                                            <div className="locationStyle"><span>所处位置:</span>{item.devUse ? item.devLocation ? <div>[{item.devLocation}]<a onClick={this.goMap.bind(this,item.devLocation,item.devName)}>点击查看</a></div>:"暂时未录入位置" : "暂停使用,无位置记录"}</div>
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
export default ListDev