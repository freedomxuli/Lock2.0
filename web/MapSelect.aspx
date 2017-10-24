<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<title></title>
<style type="text/css">
*{
    margin:0px;
    padding:0px;
}
body, button, input, select, textarea {
    font: 12px/16px Verdana, Helvetica, Arial, sans-serif;
}
p{
    width:603px;
    padding-top:3px;
	margin-top:10px;
    overflow:hidden;
}
#map_canvas {
   min-width:603px;
   min-height:767px;
}
</style>
<script charset="utf-8" src="http://map.qq.com/api/js?v=2.exp"></script>
<script>
    var searchService, map, markers = [];
    var citylocation, marker;
    var geocoder, infowindow;
    var objinfo = {};//地址经纬度信息
    var init = function () {
        map = new qq.maps.Map(document.getElementById('map_canvas'), {
            //center: center,
            zoom: 13
        });


        //获取城市列表接口设置中心点
        citylocation = new qq.maps.CityService({
            complete: function (result) {
                map.setCenter(result.detail.latLng);

                //清除原先标注物
                clearmarker();
                //添加标注物
                marker = new qq.maps.Marker({
                    map: map,
                    draggable: true,
                    position: result.detail.latLng
                });

                getlnglattoaddress(result.detail.latLng);
                qq.maps.event.addListener(marker, 'dragend', function () {
                    if (infowindow != null && infowindow != "")
                        infowindow.close();
                    getlnglattoaddress(marker.getPosition());
                });

                //console.log(result.detail.latLng);
            }
        });
        //调用searchLocalCity();方法    根据用户IP查询城市信息。
        citylocation.searchLocalCity();
        var latlngBounds = new qq.maps.LatLngBounds();
        //调用Poi检索类
        searchService = new qq.maps.SearchService({
            complete: function (results) {
                var pois = results.detail.pois;
                if (pois.length > 0) {

                    map.setCenter(pois[0].latLng);

                    marker = new qq.maps.Marker({
                        map: map,
                        draggable: true,
                        position: pois[0].latLng
                    });

                    getlnglattoaddress(pois[0].latLng);
                    qq.maps.event.addListener(marker, 'dragend', function () {
                        if (infowindow != null && infowindow != "")
                            infowindow.close();
                        getlnglattoaddress(marker.getPosition());
                    });
                }
                else {
                    objinfo = {};
                    window.parent.updateparentinfo(objinfo);
                    alert("未找到你要搜索的地址");
                }


            },
            error: function () {
                objinfo = {};
                window.parent.updateparentinfo(objinfo);
                alert("未找到你要搜索的地址");
            }
        });

        //监听地图选点
        qq.maps.event.addListener(map, 'click', function (event) {
            clearmarker();

            marker = new qq.maps.Marker({
                position: event.latLng,
                draggable: true,
                map: map
            });
            getlnglattoaddress(event.latLng);

            qq.maps.event.addListener(marker, 'dragend', function () {
                if (infowindow != null && infowindow != "")
                    infowindow.close();
                getlnglattoaddress(marker.getPosition());
            });


        });
    }

    function clearmarker() {
        if (marker != null && marker != "")
            marker.setMap(null);

        if (infowindow != null && infowindow != "")
            infowindow.close();
    }

    //关键字检索
    function searchKeyword() {
        clearmarker();
        var keyword = document.getElementById("keyword").value;
        //searchService.setLocation(region);
        searchService.search(keyword);
    }

    //经纬度地址解析
    function getlnglattoaddress(latLng) {
        //地址和经纬度之间进行转换服务
        geocoder = new qq.maps.Geocoder();
        //对指定经纬度进行解析
        geocoder.getAddress(latLng);
        //设置服务请求成功的回调函数
        //设置服务请求成功的回调函数
        geocoder.setComplete(function (result) {

            //点击Marker会弹出反查结果
            infowindow = new qq.maps.InfoWindow({
                map: map
            });

            infowindow.open();
            infowindow.setContent('<div style="width:210px;height35px;">' +
                    result.detail.address + '</div>');
            infowindow.setPosition(result.detail.location);

            //保存经纬度地址信息
            objinfo.address = result.detail.address
            var detailinfo = result.detail.addressComponents;

            //省市区
            objinfo.province = detailinfo.province;
            objinfo.city = detailinfo.city;
            objinfo.county = detailinfo.district

            //街道
            objinfo.streetnumber = detailinfo.streetNumber


            objinfo.lat = result.detail.location.lat;
            objinfo.lng = result.detail.location.lng;

            window.parent.updateparentinfo(objinfo);

        });
    }


    function getpointobj() {
        return objinfo;
    }
</script>
</head>
<body onload="init()">
<div>
    <input id="keyword" type="textbox" value="" placeholder="请输入关键字检索" style="width:300px">
    <!--<input id="region" type="textbox" value="北京">-->
    <input type="button" value="查询" onclick="searchKeyword()">
</div>
<div id="map_canvas"></div>

</body>
</html>
