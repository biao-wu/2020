var list1 = '{{json_data}}';
console.log(list1)
var content1 =
    '<div class="title-box">' +
    '<span class="item">余氯警戒点：{{json_data.NTU}}</span>' +
    '<span class="item"> PH警戒点：{{json}} </span>' +
    '<span class="item">浊度警戒点：3</span>' +
    "</div>" +
    '<div class="time-box">' +
    '<span class="item">余氯警戒点：1.5</span>' +
    '<span class="item"> PH警戒点：2 </span>' +
    '<span class="item">浊度警戒点：3</span>' +
    '<span class="item time">上报时间：2019/12/20 15:36:20</span>' +
    "</div>" +
    '<div class="btn-box">' +
    '<span class="item one">实时数据监控</span>' +
    '<span class="item two">对比数据分析</span>' +
    "</div>" +
    "<span class='arrow'></span>" +
    "</div>" +
    "</div>";
var map = new BMap.Map("map", {enableMapClick: false});
var point = new BMap.Point(116.571354, 29.883272);
map.centerAndZoom(point, 14);
map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
// 创建坐标点
var companyIcon1 = new BMap.Icon(
    "/static/images/online-point.png",
    new BMap.Size(36, 41)
);
var companyIcon2 = new BMap.Icon(
    "/static/images/outline-point.png",
    new BMap.Size(36, 41)
);
var companyIcon3 = new BMap.Icon(
    "/static/images/catch-point.png",
    new BMap.Size(86, 98)
);
var PointArr = [
    {
        log: 116.571354,
        lat: 29.883272,
        type: "online"
    },
    {
        log: 116.571354,
        lat: 29.863272,
        type: "outline"
    },
    {
        log: 116.571354,
        lat: 29.843272,
        type: "catch"
    }
];

PointArr.forEach(function (item, index) {
    var icon = "";
    switch (item.type) {
        case "online":
            icon = companyIcon1;
            break;

        case "outline":
            icon = companyIcon2;
            break;

        case "catch":
            icon = companyIcon3;
            break;

        default:
            break;
    }
    var marker = new BMap.Marker(new BMap.Point(item.log, item.lat), {
        icon: icon
    });
    map.addOverlay(marker); // 地图添加标点
    var mapTip =
        '<div class="map-tip-par"><div class="map-tip-box map-tip-' +
        item.type +
        '">';
    var content2 = mapTip + content1;
    var opts1 = {width: 700};
    var infoWindow = new BMap.InfoWindow(content2, opts1);
    marker.addEventListener("click", function (e) {
        if (item.type === "catch") {
            $("#index").addClass("infoWindow-catch");
        } else {
            $("#index").removeClass("infoWindow-catch");
        }
        marker.openInfoWindow(infoWindow);
    });
});
$.ajax({
        type: "get",
        url: "/map",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            let content9 = "";
            for (var k in data){
                var chlorine = data[k].chlorine;
                var PH = data[k].PH;
                var NTU = data[k].NTU
                var time = data[k].time
            }
            console.log(chlorine,PH,NTU,time);
            content9 = '<div class="title-box">' +
                '<span class="item">余氯警戒点：chlorine</span>' +
                '<span class="item"> PH警戒点：PH </span>' +
                '<span class="item">浊度警戒点：NTU</span>' +
                "</div>" +
                '<div class="time-box">' +
                '<span class="item">余氯警戒点：1.5</span>' +
                '<span class="item"> PH警戒点：2 </span>' +
                '<span class="item">浊度警戒点：3</span>' +
                '<span class="item time">上报时间：time</span>' +
                "</div>" +
                '<div class="btn-box">' +
                '<span class="item one">实时数据监控</span>' +
                '<span class="item two">对比数据分析</span>' +
                "</div>" +
                "<span class='arrow'></span>" +
                "</div>" +
                "</div>";
        }
    }
);