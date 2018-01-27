function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


jQuery.fn.getParmByUrl2 = function (o) {
    var url = window.location.toString();
    var tmp;
    if (url && url.indexOf("?")) {
        var arr = url.split("?");
        var parms = arr[1];
        if (parms && parms.indexOf("&")) {
            var parmList = parms.split("&");
            jQuery.each(parmList, function (key, val) {
                if (val && val.indexOf("=")) {
                    var parmarr = val.split("=");
                    if (o) {
                        if (typeof (o) == "string" && o == parmarr[0].toLowerCase()) {
                            tmp = parmarr[1] == null ? '' : parmarr[1];
                        }
                    }
                    else {
                        tmp = parms;
                    }
                }
            });
        }
    }
    if (typeof (tmp) == "undefined")
        tmp = "";
    return tmp;
}