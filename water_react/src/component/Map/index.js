import React, { Component } from 'react'

export default class Map extends Component {
    constructor(props) {
        super(props)
        this.state={
            j: props.match.params.location.split("&")[0].split(",")[0]||32.94043,
            w: props.match.params.location.split("&")[0].split(",")[1]||117.38126
        }
        
    }
    componentDidMount() {
        let {j,w}=this.state
        console.log(j,w)
        var container = document.getElementById("container");
        var center = new window.TMap.LatLng(j,w);//设置中心点坐标
        //初始化地图
        var map = new window.TMap.Map(container, {
            center: center
        });
        //初始marker
        var marker = new window.TMap.MultiMarker({
            id: 'marker-layer',
            map: map,
            styles: {
                "marker": new window.TMap.MarkerStyle({
                    "width": 35,
                    "height": 35,
                    "anchor": { x: 12, y: 32 },
                    "src": '/api/upload/map.png'
                })
            },
            geometries: [{
                "id": 'demo1',
                "styleId": 'marker',
                "position": new window.TMap.LatLng(j,w),
                "properties": {
                    "title": "marker"
                }
            }]
        });
        //初始化infoWindow
        var infoWindow = new window.TMap.InfoWindow({
            map: map,
            position: new window.TMap.LatLng(j,w),
            offset: { x: 0, y: -32 } //设置信息窗相对position偏移像素，为了使其显示在Marker的上方
        });
        infoWindow.close();//初始关闭信息窗关闭
        //监听标注点击事件
        marker.on("click", function (evt) {
            //设置infoWindow
            infoWindow.open(); //打开信息窗
            infoWindow.setPosition(evt.geometry.position);//设置信息窗位置
            infoWindow.setContent(evt.geometry.position.toString());//设置信息窗内容
        })
    }
    render() {
        return (
            <div>
                <div id="container"></div>
            </div>
        )
    }
}
