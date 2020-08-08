import React, { Component } from 'react'
import { Upload } from 'antd';
import { up, addShare} from "../../api/request"
import { Button, Spin, notification } from 'antd';
export default class AddShare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            img: "",
            contents:"",
            sping:false
        }
    }
    up = (e) => {
        var form = new FormData()
        form.append('file', e.file)
        up(form).then(res => {
            console.log(res);
            if (res.data.status === 0) {
                this.setState({
                    img: "http://localhost:8000/" + res.data.path
                })
            }
        })
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
    onSure=()=>{
        this.setState({
            sping: true
        })
        let {contents,img}=this.state;
        console.log({ contents, imgSrc: img });
        
        addShare({contents,imgSrc:img}).then(res=>{
            console.log(res);
            if(res.data.state){
                //添加成功
                this.openNotificationWithIcon('success', "共享成功")
            }
        }).catch(err=>{
            //网络错误
            this.openNotificationWithIcon('error', "网络错误")
        }).finally(()=>{
            this.setState({
                sping: false
            })
        })
    }
    render() {
        let { contents,sping}=this.state
        return (
            <div>
                <Upload listType="picture-card" showUploadList={false} customRequest={this.up}>
                    {
                        this.state.img ? <img style={{ width: "100px", height: "100px" }} src={this.state.img} alt="" /> : "上传"
                    }
                </Upload>
                <div>
                    <div>
                        <h4>发布内容:</h4>
                        <textarea style={{ width: "500px",height:"200px" }} id="contents" value={contents} onChange={this.change.bind(this)} />
                    </div>
                    <br />
                    <Spin spinning={sping}>
                        <Button type="primary" shape="round" onClick={this.onSure}>发布</Button>
                    </Spin>
                </div>
            </div>
        )
    }
}
