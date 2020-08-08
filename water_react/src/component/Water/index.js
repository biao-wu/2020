import React, { Component } from 'react'
import echarts from "echarts"
import { getWater} from "../../api/request"
export default class Water extends Component {
    constructor(){
        super()
        this.state={
            nowData:"",
            dataList:[],
            dataX:[],
            pH:[],
            NTU:[],
            oxygen:[],
            tem:[],
            ele:[]
        }
    }
    componentDidMount(){
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('main'));
        getWater().then(res=>{
            console.log(res);
            res.data.forEach(item => {
                let item1=item.time.split("T")
                //当前日期  如三月十四号
                this.state.nowData=item1[0]
                //时间小时:分
                this.state.dataX.push(item1[1].slice(0,5))
                //pH
                this.state.pH.push(item.pH)
                //浑浊度
                this.state.NTU.push(item.NTU)
                //溶解氧
                this.state.oxygen.push(item.oxygen)
                //水温
                this.state.tem.push(item.tem)
                //电导率
                this.state.ele.push(item.ele)
            })
            this.setState({
                dataList : Object.keys(res.data[0])
            })
            // 绘制图表
           
            myChart.setOption({
                title: {
                    text: '水质参数'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    //哪些曲线
                    data: this.dataList
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.state.dataX
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: "pH值",
                        type: 'line',
                        data: this.state.pH
                    },
                    {
                        name: "浑浊度",
                        type: 'line',
                        data: this.state.NTU
                    },
                    {
                        name: "溶解氧",
                        type: 'line',
                        data: this.state.oxygen
                    },
                    {
                        name: "温度",
                        type: 'line',
                        data: this.state.tem
                    },
                    {
                        name: "电导率",
                        type: 'line',
                        data: this.state.ele
                    }
                ]
            });
        })  
    }
    render() {
        return (
           <div>
                <h1 style={{textAlign:"center",fontSize:"26px"}}>{this.state.nowData}</h1>
                <div id="main" style={{width: "1000px",height:"520px"}}></div>
                
           </div>
        )
    }
}
