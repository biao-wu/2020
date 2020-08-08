import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { Layout, Menu, Dropdown } from 'antd';
import { ProfileOutlined, SettingOutlined, ShareAltOutlined, SlidersOutlined, SnippetsOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

@withRouter
class Admin extends Component {
    go = ({ key }) => {
        this.props.history.push(key)
    }
    //退出
    quit=()=>{
        sessionStorage.clear()
        this.props.history.push("/login")
    }
    //菜单列表
    showmenu = () => {
        return (
            <Menu>
                <Menu.Item key="/home/upUserInfo" onClick={this.go}>
                    修改个人信息
                </Menu.Item>
                {
                    sessionStorage.getItem("name") === "root" ? <Menu.Item key="/home/addAdmin"  onClick={this.go}>添加管理员</Menu.Item> : ""
                }
                <Menu.Item onClick={this.quit}>
                    退出
                </Menu.Item>
            </Menu>
        )
    }
    render() {
        return (
            <div>
                <Layout>
                    <Header className="header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <h1 style={{ color: "white" }}>水质监控系统</h1>
                        <Dropdown overlay={this.showmenu}>
                            <a href="/#" onClick={e => e.preventDefault()}>
                                你好,{sessionStorage.getItem("name")}
                            </a>
                        </Dropdown>
                    </Header>
                    <Layout>
                        {/* collapsed控制侧边栏的展开或者回缩 */}
                        <Sider width={180} className="site-layout-background" collapsed={false}>
                            <Menu
                                mode="inline"
                                selectedKeys={this.props.location.pathname}
                                onClick={this.go}
                                style={{ height: '100%', borderRight: 0 }}
                            >
                                <Menu.Item key="/home/loginLogs"><ProfileOutlined />登录日志</Menu.Item>
                                <SubMenu
                                    title={
                                        <span>
                                            <SnippetsOutlined />
                                            <span>操作日志</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="/home/opaMyLogs">本账号操作日志</Menu.Item>
                                    <Menu.Item key="/home/opaAllLogs">所有操作日志</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    title={
                                        <span>
                                            <SlidersOutlined />
                                            <span>水质图表</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="/home/water">所有数据</Menu.Item>
                                    <Menu.Item><a href="http://localhost:8000/water">大屏展示</a></Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    title={
                                        <span>
                                            <SlidersOutlined />
                                            <span>设备管理</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="/home/ListDev">设备列表</Menu.Item>
                                    <Menu.Item key="/home/dev">添加设备</Menu.Item>
                                    <Menu.Item key="/home/updataDev/请输入设备编号进行修改设备信息">修改设备信息</Menu.Item>
                                    {sessionStorage.getItem("name") === "root" ? <Menu.Item key="/home/dltDev">删除设备</Menu.Item>:""}
                                </SubMenu>
                                <SubMenu
                                    title={
                                        <span>
                                            <ShareAltOutlined />
                                            <span>信息共享中心</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="/home/addShare">添加分享</Menu.Item>
                                    <Menu.Item key="/home/share">共享中心</Menu.Item>
                                    <Menu.Item key="/home/searchShare">搜索作者</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    title={
                                        <span>
                                            <SettingOutlined />
                                            <span>设置</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="/home/personInfo">个人信息</Menu.Item>
                                    <Menu.Item key="/home/upUserInfo">修改基本信息</Menu.Item>
                                    <Menu.Item key="/home/upUserPwd">修改密码</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>
                            {/* 这里可以书写面包屑 */}
                            <Content
                                className="site-layout-background"
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 558,
                                }}
                            >
                                {this.props.children}
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
export default Admin