function b() {
    h = $(window).height(),
    t = $(document).scrollTop();
    var e = $("#back-top").attr("daty-id");
    e ? t > h ? ($("#gotop").show(), $(".fix-right .tips,.fix-right .has-ask").show()) : ($("#gotop").hide(), $(".fix-right .tips,.fix-right .has-ask").hide()) : ($(".fix-right .tips,.fix-right .has-ask").show(), t > h ? $("#gotop").show() : $("#gotop").hide())
}
function ent() {
    var e;
    $(".ewm-close").click(function(t) {
        $(".sh-erweima").hide().addClass("hide"),
        $(this).hide();
        var n = $(".sh-erweima").attr("class");
        localStorage.setItem(e, JSON.stringify(n))
    });
    var t = localStorage.getItem(e);
    t ? t.indexOf("sh-erweima hide") >= 0 && $(".sh-erweima,.ewm-close").hide() : $(".sh-erweima,.ewm-close").show()
} !
function(e) {
    e.fn.scrollLoading = function(t) {
        var n = {
            attr: "data-url",
            container: e(window),
            callback: e.noop
        },
        a = e.extend({},
        n, t || {});
        a.cache = [],
        e(this).each(function() {
            var t = this.nodeName.toLowerCase(),
            n = e(this).attr(a.attr),
            r = {
                obj: e(this),
                tag: t,
                url: n
            };
            a.cache.push(r)
        });
        var r = function(t) {
            e.isFunction(a.callback) && a.callback.call(t.get(0))
        },
        o = function() {
            var t, n = a.container.height();
            t = e(window).get(0) === window ? e(window).scrollTop() : a.container.offset().top,
            e.each(a.cache,
            function(e, a) {
                var o = a.obj,
                i = a.tag,
                s = a.url;
                if (o) {
                    var c = o.offset().top - t,
                    l = c + o.height(); (c >= 0 && c < n || l > 0 && l <= n) && (s ? "img" === i ? r(o.attr("src", s)) : o.load(s, {},
                    function() {
                        r(o)
                    }) : r(o), a.obj = null)
                }
            })
        };
        o(),
        a.container.bind("scroll", o)
    }
} (jQuery),
function(e, t, n, a) {
    var r = e(t);
    e.fn.lazyload = function(o) {
        function i() {
            var t = 0;
            c.each(function() {
                var n = e(this);
                if (!l.skip_invisible || n.is(":visible")) if (e.abovethetop(this, l) || e.leftofbegin(this, l));
                else if (e.belowthefold(this, l) || e.rightoffold(this, l)) {
                    if (++t > l.failure_limit) return ! 1
                } else n.trigger("appear"),
                t = 0
            })
        }
        var s, c = this,
        l = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: t,
            data_attribute: "original",
            skip_invisible: !0,
            appear: null,
            load: null,
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };
        return o && (a !== o.failurelimit && (o.failure_limit = o.failurelimit, delete o.failurelimit), a !== o.effectspeed && (o.effect_speed = o.effectspeed, delete o.effectspeed), e.extend(l, o)),
        s = l.container === a || l.container === t ? r: e(l.container),
        0 === l.event.indexOf("scroll") && s.bind(l.event,
        function() {
            return i()
        }),
        this.each(function() {
            var t = this,
            n = e(t);
            t.loaded = !1,
            n.attr("src") !== a && n.attr("src") !== !1 || n.is("img") && n.attr("src", l.placeholder),
            n.one("appear",
            function() {
                if (!this.loaded) {
                    if (l.appear) {
                        var a = c.length;
                        l.appear.call(t, a, l)
                    }
                    e("<img />").bind("load",
                    function() {
                        var a = n.attr("data-" + l.data_attribute);
                        n.hide(),
                        n.is("img") ? n.attr("src", a) : n.css("background-image", "url('" + a + "')"),
                        n[l.effect](l.effect_speed),
                        t.loaded = !0;
                        var r = e.grep(c,
                        function(e) {
                            return ! e.loaded
                        });
                        if (c = e(r), l.load) {
                            var o = c.length;
                            l.load.call(t, o, l)
                        }
                    }).attr("src", n.attr("data-" + l.data_attribute))
                }
            }),
            0 !== l.event.indexOf("scroll") && n.bind(l.event,
            function() {
                t.loaded || n.trigger("appear")
            })
        }),
        r.bind("resize",
        function() {
            i()
        }),
        /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && r.bind("pageshow",
        function(t) {
            t.originalEvent && t.originalEvent.persisted && c.each(function() {
                e(this).trigger("appear")
            })
        }),
        e(n).ready(function() {
            i()
        }),
        this
    },
    e.belowthefold = function(n, o) {
        var i;
        return i = o.container === a || o.container === t ? (t.innerHeight ? t.innerHeight: r.height()) + r.scrollTop() : e(o.container).offset().top + e(o.container).height(),
        i <= e(n).offset().top - o.threshold
    },
    e.rightoffold = function(n, o) {
        var i;
        return i = o.container === a || o.container === t ? r.width() + r.scrollLeft() : e(o.container).offset().left + e(o.container).width(),
        i <= e(n).offset().left - o.threshold
    },
    e.abovethetop = function(n, o) {
        var i;
        return i = o.container === a || o.container === t ? r.scrollTop() : e(o.container).offset().top,
        i >= e(n).offset().top + o.threshold + e(n).height()
    },
    e.leftofbegin = function(n, o) {
        var i;
        return i = o.container === a || o.container === t ? r.scrollLeft() : e(o.container).offset().left,
        i >= e(n).offset().left + o.threshold + e(n).width()
    },
    e.inviewport = function(t, n) {
        return ! (e.rightoffold(t, n) || e.leftofbegin(t, n) || e.belowthefold(t, n) || e.abovethetop(t, n))
    },
    e.extend(e.expr[":"], {
        "below-the-fold": function(t) {
            return e.belowthefold(t, {
                threshold: 0
            })
        },
        "above-the-top": function(t) {
            return ! e.belowthefold(t, {
                threshold: 0
            })
        },
        "right-of-screen": function(t) {
            return e.rightoffold(t, {
                threshold: 0
            })
        },
        "left-of-screen": function(t) {
            return ! e.rightoffold(t, {
                threshold: 0
            })
        },
        "in-viewport": function(t) {
            return e.inviewport(t, {
                threshold: 0
            })
        },
        "above-the-fold": function(t) {
            return ! e.belowthefold(t, {
                threshold: 0
            })
        },
        "right-of-fold": function(t) {
            return e.rightoffold(t, {
                threshold: 0
            })
        },
        "left-of-fold": function(t) {
            return ! e.rightoffold(t, {
                threshold: 0
            })
        }
    })
} (jQuery, window, document),
define("common/jquery.scrollLoading",
function() {}),
function(e) {
    e.fn.fixtop = function(t) {
        var n = e.extend({
            marginTop: 0,
            zIndex: 1e3,
            fixedWidth: "100%"
        },
        t),
        a = this.offset().top - n.marginTop,
        r = this,
        o = (r.height() + n.marginTop, e("<div/>").css({
            display: r.css("display"),
            width: r.outerWidth(!0),
            height: r.outerHeight(!0),
            float: r.css("float")
        }));
        return e(window).scroll(function(t) {
            var i = a;
            e(this).scrollTop() > i && "fixed" != r.css("position") && (r.after(o), r.css({
                position: "fixed",
                top: n.marginTop + "px",
                "z-index": n.zIndex,
                width: n.fixedWidth
            }), void 0 !== n.fixed && n.fixed(r)),
            e(this).scrollTop() < i && "fixed" == r.css("position") && (o.remove(), r.css({
                position: "relative",
                top: "0px",
                "z-index": n.zIndex
            }), void 0 !== n.unfixed && n.unfixed(r))
        }),
        this
    }
} (jQuery),
define("common/fixtop",
function() {}),
$.stringFormat = function(e, t) {
    e = String(e);
    var n = Array.prototype.slice.call(arguments, 1),
    a = Object.prototype.toString;
    return n.length ? (n = 1 == n.length && null !== t && /\[object Array\]|\[object Object\]/.test(a.call(t)) ? t: n, e.replace(/#\{(.+?)\}/g,
    function(e, t) {
        var r = n[t];
        return "[object Function]" == a.call(r) && (r = r(t)),
        "undefined" == typeof r ? "": r
    })) : e
},
$.trimN = function(e) {
    return e.replace(/\n{2,}/gm, "\n")
},
$.fixedOldComment = function(e) {
    return e ? $.decodeHTML($.trimN(e.replace(/<[^>]+>/g, "\n"))) : e
},
$.replaceTpl = function(e, t, n) {
    var a = String(e),
    r = n || /#\{([^}]*)\}/gm,
    o = String.trim ||
    function(e) {
        return e.replace(/^\s+|\s+$/g, "")
    };
    return a.replace(r,
    function(e, n) {
        return e = t[o(n)]
    })
},
$.strHTML = function(e, t) {
    e = String(e);
    var n = Array.prototype.slice.call(arguments, 1),
    a = Object.prototype.toString;
    return n.length ? (n = 1 == n.length && null !== t && /\[object Array\]|\[object Object\]/.test(a.call(t)) ? t: n, e.replace(/#\{(.+?)\}/g,
    function(e, t) {
        var r = n[t];
        return "[object Function]" == a.call(r) && (r = r(t)),
        "undefined" == typeof r ? "": $.encodeHTML(r)
    })) : e
},
$.showIframeImg = function(e, t) {
    var n = "<style>body{margin:0;padding:0}img{width:#{0}px;height:#{1}px;}</style>",
    a = $(e),
    r = a.height(),
    o = a.width(),
    i = $.stringFormat(n, o, r),
    s = "frameimg" + Math.round(1e9 * Math.random());
    window.betafang[s] = "<head>" + i + '</head><body><img id="img-' + s + "\" src='" + t + "' /></body>",
    e.append('<iframe style="display:none" id="' + s + '" src="javascript:parent.betafang[\'' + s + '\'];" frameBorder="0" scrolling="no" width="' + o + '" height="' + r + '"></iframe>')
},
$.loadScript = function(e) {
    function t() {
        return ! r && (r = !0, o.onload = null, o.onerror = null, a.complete && a.complete(), s.resolve(), void i.removeChild(o))
    }
    function n() {
        return ! r && (r = !0, a.fail && a.fail(), i.removeChild(o), void s.reject())
    }
    var a = {
        url: "",
        charset: "utf-8",
        complete: $.noop,
        fail: $.noop
    };
    if ($.extend(a, e), !a.url) throw "url is requireed";
    var r = !1,
    o = document.createElement("script"),
    i = document.getElementsByTagName("head")[0],
    s = $.Deferred();
    return o.onload = t,
    o.onerror = n,
    o.onreadystatechange = function(e) {
        "complete" == o.readyState && t()
    },
    o.type = "text/javascript",
    o.src = a.url,
    o.charset = a.charset,
    i.appendChild(o),
    s
},
$.TextAreaUtil = function(e) {
    var t = document.selection,
    n = {
        getCursorPosition: function(e) {
            var n = 0;
            if (t) {
                e.focus();
                try {
                    var a = null;
                    a = t.createRange();
                    var r = a.duplicate();
                    r.moveToElementText(e),
                    r.setEndPoint("EndToEnd", a),
                    e.selectionStartIE = r.text.length - a.text.length,
                    e.selectionEndIE = e.selectionEndIE + a.text.length,
                    n = e.selectionStartIE
                } catch(t) {
                    n = e.value.length
                }
            } else(e.selectionStart || "0" == e.selectionStart) && (n = e.selectionStart);
            return n
        },
        getSelectedText: function(t) {
            var n = "",
            a = function(e) {
                return void 0 != e.selectionStart && void 0 != e.selectionEnd ? e.value.slice(e.selectionStart, e.selectionEnd) : ""
            };
            return n = e.getSelection ? a(t) : document.selection.createRange().text
        }
    };
    return n
} (window),
$.browser = $.browser || {},
$.browser.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? document.documentMode || +RegExp.$1: void 0;
var betafang = window.betafang || {};
$(function() { / msie(\d + \.\d + ) / i.test(navigator.userAgent) && $("body").addClass("ie", "ie" + (document.documentMode || +RegExp.$1)),
    $(".lj-lazy").lazyload(),
    $(".lazyload").scrollLoading();
    var e = $("#keyword-box,#keyword-box-01");
    e.closest("form").on("submit",
    function() {
        var e = $(this),
        t = e.attr("data-action") || e.attr("action"),
        n = e.find(".txt"),
        a = $.trim(n.val());
        return a == n.attr("placeholder") && (a = ""),
        t += encodeURIComponent(a),
        "_blank" != e.attr("target") ? (window.location.href = t, !1) : void e.attr("action", t)
    })
}),
define("common/base",
function() {});
var ajax = function() {
    var e = {},
    t = function() {};
    return e.get = function(e, n, a, r) {
        return a = a || t,
        r = r || t,
        !!e && void $.getJSON(e, n,
        function(e) {
            0 === e.status ? a(e.data) : r(e)
        },
        function(e) {
            var t = {
                status: 500,
                statusInfo: "服务请求失败"
            };
            r(t)
        })
    },
    e.post = function(e, n, a, r) {
        return a = a || t,
        r = r || t,
        !!e && void $.ajax({
            type: "POST",
            url: e,
            data: n,
            success: function(e) {
                0 === e.status ? a(e.data) : r(e)
            },
            failure: function(e) {
                var t = {
                    status: 500,
                    statusInfo: "服务请求失败"
                };
                r(t)
            },
            dataType: "json"
        })
    },
    e
} ();
define("common/ajax",
function() {}),
function() {
    function e(e, t) {
        var n = document.getElementsByTagName("head")[0],
        a = document.createElement("script");
        a.type = "text/javascript",
        a.src = e,
        t = t ||
        function() {},
        a.onload = a.onreadystatechange = function() {
            this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (t(), a.onload = a.onreadystatechange = null, n && a.parentNode && n.removeChild(a))
        },
        n.insertBefore(a, n.firstChild)
    }
    function t(t, n, r) {
        var o = "cbk_" + Math.round(1e4 * Math.random()),
        i = a + "?from=" + n + "&to=4&x=" + t.lng + "&y=" + t.lat + "&callback=BMap.Convertor." + o;
        r = r ||
        function() {},
        e(i),
        BMap.Convertor[o] = function(e) {
            delete BMap.Convertor[o];
            var t = new BMap.Point(e.x, e.y);
            r(t)
        }
    }
    function n(t, n, r) {
        var o = a + "?from=" + n + "&to=4&mode=1",
        i = [],
        s = [],
        c = 20;
        r = r ||
        function() {};
        var l = function() {
            var t = "cbk_" + Math.round(1e4 * Math.random()),
            n = o + "&x=" + i.join(",") + "&y=" + s.join(",") + "&callback=BMap.Convertor." + t;
            e(n),
            i = [],
            s = [],
            BMap.Convertor[t] = function(e) {
                delete BMap.Convertor[t];
                var n = null,
                a = [];
                for (var o in e) if (n = e[o], 0 === n.error) {
                    var i = new BMap.Point(n.x, n.y);
                    a[o] = i
                } else a[o] = null;
                r(a)
            }
        };
        for (var u in t) u % c === 0 && 0 !== u && l(),
        i.push(t[u].lng),
        s.push(t[u].lat),
        u == t.length - 1 && l()
    }
    var a = "//api.map.baidu.com/ag/coord/convert";
    window.BMap = window.BMap || {},
    BMap.Convertor = $({}),
    BMap.Convertor.translate = t,
    BMap.Convertor.translateMore = n
} ();
var LJFixed = function(e, t) {
    function n(t) {
        if (!r.isSupportPlaceHolder) {
            var n = e(t),
            a = n.attr("placeholder");
            "" === n.val() && n.val(a).addClass("placeholder"),
            n.focus(function() {
                n.val() === n.attr("placeholder") && n.val("").removeClass("placeholder")
            }).blur(function() {
                "" === n.val() && n.val(n.attr("placeholder")).addClass("placeholder")
            }).closest("form").submit(function() {
                n.val() === n.attr("placeholder") && n.val("")
            })
        }
    }
    function a() {
        e("input[placeholder],textarea[placeholder]").each(function() {
            var t = e(this);
            "password" != t.attr("type") && n(this)
        })
    }
    var r = {
        isSupportPlaceHolder: "placeholder" in t.createElement("input")
    };
    e(function() {
        a()
    }),
    e.fixPlaceholder = n;
    var o = {};
    return o.fixedPlaceHolder = n,
    o
} ($, document);
define("common/fixed",
function() {});
var Pagination = function(require) {
    function e(e, t, n) {
        var a = [];
        if (n = n || 6, t = t || 1, e <= n) for (var r = 0; r < e; r++) a.push(r + 1);
        else {
            a.push(1),
            t > 4 && a.push("");
            for (var o = Math.max(t - 2, 2), i = Math.min(t + 2, e - 1), r = o; r <= i; r++) a.push(r);
            t < e - 3 && a.push(""),
            a.push(e)
        }
        return a
    }
    function t(e, t, n, a) {
        function r(e) {
            if (a) {
                var t = a.replace(/\{page\}/g, e);
                return 1 === e && t.search("pg1") > -1 && (t = t.search("pg1/") > -1 ? t.replace(/pg1\//, "") : t.replace(/pg1/, "")),
                t
            }
            return "javascript:;"
        }
        var o = [];
        if (n = n || 1, e && e.length) {
            n > 1 && t > 6 && o.push('<a href="' + r(n - 1) + '" data-page="' + (n - 1) + '" >上一页</a>');
            for (var i = e.length,
            s = 0; s < i; s++) o.push(e[s] ? "<a " + (e[s] == n ? 'class="on"': "") + ' href="' + r(e[s]) + '" data-page="' + e[s] + '">' + e[s] + "</a>": "<span>...</span>");
            n < t && t > 6 && o.push('<a href="' + r(n + 1) + '" data-page="' + (n + 1) + '">下一页</a>')
        }
        return o.join("")
    }
    function n(n) {
        function a() {
            r(),
            s(),
            i(),
            o()
        }
        function r() {
            c.template = c.dom.attr("page-url");
            var e = c.dom.attr("target-wrapper");
            e && (c.targetWrapper = $(e));
            var t = c.dom.attr("page-data");
            t ? (t = $.parseJSON(t), $.extend(c, t)) : c.targetWrapper && (c.curPage = 1, c.totalPage = c.targetWrapper.children().length)
        }
        function o() {
            if (! (c.totalPage <= 1)) {
                var n = e(c.totalPage, c.curPage);
                n.length || c.dom.hide();
                var a = t(n, c.totalPage, c.curPage, c.template);
                if (c.dom.html(a), c.targetWrapper) {
                    var r = c.targetWrapper.children();
                    r.hide(),
                    r.eq(c.curPage - 1).show(),
                    c.targetWrapper.find(".lj-lazy").lazyload()
                }
            }
        }
        function i() {
            c.targetWrapper && l.on("showPage",
            function(e, t) {
                c.curPage = t,
                o()
            })
        }
        function s() {
            c.dom.delegate("[data-page]", "click",
            function() {
                var e = $(this).attr("data-page");
                l.trigger("showPage", parseInt(e))
            })
        }
        if (n) {
            var c = {
                dom: $(n),
                template: "",
                targetWrapper: "",
                totalPage: 0,
                curPage: 0
            },
            l = $({});
            return a(),
            l
        }
    }
    return $(function() {
        var e = $("[comp-module='page']");
        e.each(function() {
            n($(this))
        })
    }),
    n
} ();
define("common/pagination",
function() {}),
$(document).ready(function(e) {
    b(),
    ent(),
    $("body").on("click", "#gotop",
    function() {
        $("html , body").animate({
            scrollTop: 0
        },
        1e3)
    })
}),
$(window).scroll(function(e) {
    b()
}),
$("body").on("click", "#back-top .mycart .popup",
function(e) {
    e.stopPropagation()
}),
define("common/backtop",
function() {}),
define("common/env",
function(require) {
    function e() {
        var e = $.parseURL(location.href);
        n.host = e.host,
        n.scheme = e.scheme,
        n.port = e.port;
        var t = n.host.match(/\.?(\w+)\.lianjia\.com/)[1];
        0 === t.indexOf("dev") ? n.env = "dev": 0 === t.indexOf("test") && (n.env = "test")
    }
    function t(e) {
        var t = "";
        return e.scheme && (t += e.scheme + "://"),
        e.host && (t += e.host),
        e.port && (t += ":" + e.port),
        e.path && (t += "/" + e.path),
        e.query && (t += "?" + e.query),
        e.hash && (t += "#" + e.hash),
        t
    }
    var n = {
        host: "",
        scheme: "",
        port: "",
        env: "online"
    },
    a = {};
    return a.getEnv = function() {
        return n.env
    },
    a.fixedHost = function(e) {
        if (!e) return n.host;
        var t = e.substring(0, e.indexOf("."));
        switch (n.env) {
            case "dev":
            case "test":
                if (0 !== t.indexOf(n.env)) return n.env + e;
                break;
            case "online":
        }
        return e
    },
    a.fixedUrl = function(e) {
        e.indexOf("http") < 0 && (e = location.protocol + e);
        var r = $.parseURL(e);
        return r.host ? (r.host = a.fixedHost(r.host), r.port = n.port, r.scheme || (r.scheme = n.scheme)) : (r.host = n.host, r.scheme = n.scheme, r.port = n.port),
        t(r)
    },
    a.isSameDomain = function(e) {
        var t = $.parseURL(e);
        return t.host == n.host
    },
    e(),
    a
}),
window.LJMessenger = function() {
    function e(e, t) {
        var n = "";
        if (arguments.length < 2 ? n = "target error - target and name are both requied": "object" != typeof e ? n = "target error - target itself must be window object": "string" != typeof t && (n = "target error - target name must be string type"), n) throw new Error(n);
        this.target = e,
        this.name = t
    }
    function t(e, t) {
        this.targets = {},
        this.name = e,
        this.listenFunc = [],
        n = t || n,
        "string" != typeof n && (n = n.toString()),
        this.initListen()
    }
    var n = "[LIANJIA_Messenger_CROSS]",
    a = "postMessage" in window;
    return a ? e.prototype.send = function(e) {
        this.target.postMessage(n + e, "*")
    }: e.prototype.send = function(e) {
        var t = window.navigator[n + this.name];
        if ("function" != typeof t) throw new Error("target callback function is not defined");
        t(n + e, window)
    },
    t.prototype.addTarget = function(t, n) {
        var a = new e(t, n);
        this.targets[n] = a
    },
    t.prototype.initListen = function() {
        var e = this,
        t = function(t) {
            if ("object" == typeof t && t.data && (t = t.data), t && "string" == typeof t && t.indexOf(n) >= 0) {
                t = t.slice(n.length);
                for (var a = 0; a < e.listenFunc.length; a++) e.listenFunc[a](t)
            }
        };
        a ? "addEventListener" in document ? window.addEventListener("message", t, !1) : "attachEvent" in document && window.attachEvent("onmessage", t) : window.navigator[n + this.name] = t
    },
    t.prototype.listen = function(e) {
        this.listenFunc.push(e)
    },
    t.prototype.clear = function() {
        this.listenFunc = []
    },
    t.prototype.send = function(e) {
        var t, n = this.targets;
        for (t in n) n.hasOwnProperty(t) && n[t].send(e)
    },
    t
} (),
"object" != typeof JSON && (JSON = {}),
function() {
    "use strict";
    function f(e) {
        return e < 10 ? "0" + e: e
    }
    function quote(e) {
        return escapable.lastIndex = 0,
        escapable.test(e) ? '"' + e.replace(escapable,
        function(e) {
            var t = meta[e];
            return "string" == typeof t ? t: "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice( - 4)
        }) + '"': '"' + e + '"'
    }
    function str(e, t) {
        var n, a, r, o, i, s = gap,
        c = t[e];
        switch (c && "object" == typeof c && "function" == typeof c.toJSON && (c = c.toJSON(e)), "function" == typeof rep && (c = rep.call(t, e, c)), typeof c) {
            case "string":
                return quote(c);
            case "number":
                return isFinite(c) ? String(c) : "null";
            case "boolean":
            case "null":
                return String(c);
            case "object":
                if (!c) return "null";
                if (gap += indent, i = [], "[object Array]" === Object.prototype.toString.apply(c)) {
                    for (o = c.length, n = 0; n < o; n += 1) i[n] = str(n, c) || "null";
                    return r = 0 === i.length ? "[]": gap ? "[\n" + gap + i.join(",\n" + gap) + "\n" + s + "]": "[" + i.join(",") + "]",
                    gap = s,
                    r
                }
                if (rep && "object" == typeof rep) for (o = rep.length, n = 0; n < o; n += 1)"string" == typeof rep[n] && (a = rep[n], r = str(a, c), r && i.push(quote(a) + (gap ? ": ": ":") + r));
                else for (a in c) Object.prototype.hasOwnProperty.call(c, a) && (r = str(a, c), r && i.push(quote(a) + (gap ? ": ": ":") + r));
                return r = 0 === i.length ? "{}": gap ? "{\n" + gap + i.join(",\n" + gap) + "\n" + s + "}": "{" + i.join(",") + "}",
                gap = s,
                r
        }
    }
    "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z": null
    },
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
        return this.valueOf()
    });
    var cx, escapable, gap, indent, meta, rep;
    "function" != typeof JSON.stringify && (escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    JSON.stringify = function(e, t, n) {
        var a;
        if (gap = "", indent = "", "number" == typeof n) for (a = 0; a < n; a += 1) indent += " ";
        else "string" == typeof n && (indent = n);
        if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
        return str("", {
            "": e
        })
    }),
    "function" != typeof JSON.parse && (cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, JSON.parse = function(text, reviver) {
        function walk(e, t) {
            var n, a, r = e[t];
            if (r && "object" == typeof r) for (n in r) Object.prototype.hasOwnProperty.call(r, n) && (a = walk(r, n), void 0 !== a ? r[n] = a: delete r[n]);
            return reviver.call(e, t, r)
        }
        var j;
        if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx,
        function(e) {
            return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice( - 4)
        })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"),
        "function" == typeof reviver ? walk({
            "": j
        },
        "") : j;
        throw new SyntaxError("JSON.parse")
    })
} (),
define("xd/crossRequest",
function(require) {
    function e(e, t) {
        var n = document.createElement("iframe");
        return n.id = e,
        n.name = e,
        n.src = t,
        n.style.cssText = "display:none;width:0px;height:0px;",
        n.width = 0,
        n.height = 0,
        n.title = "empty",
        document.body.appendChild(n),
        n
    }
    var t = new LJMessenger("LIANJIA_CROSS_MESSAGE", "LIANJIA-CROSS");
    t.listen(function(e) {
        e = JSON.parse(e);
        var n = e.name;
        t.targets[n] && ("state" == e.type ? (t.targets[n].readyState = "ready", t.targets[n].dealReady()) : t.targets[n].deal(e.data, e.success))
    });
    var n = {},
    a = function(e, t) {
        var n = this;
        n.domain = e,
        t = t || $.parseURL(e).host.replace(/\./g, "-"),
        n.name = t,
        n.init()
    };
    return $.extend(a.prototype, {
        init: function() {
            var n = this,
            a = n.domain + "/xd/api/?name=" + n.name,
            r = e(n.name, a);
            n.iframe = r.contentWindow,
            t.addTarget(n.iframe, n.name),
            n.reqArray = [],
            t.targets[n.name].deal = function(e, a) {
                t.targets[n.name].isRequest = !1;
                var r = n.reqArray.shift(),
                o = !1;
                try {
                    o = e
                } catch(e) {}
                a ? r.defer.resolve(o) : r.defer.reject(o),
                n.next()
            },
            t.targets[n.name].dealReady = function() {
                n.next()
            }
        },
        next: function() {
            var e = this;
            if (t.targets[e.name].readyState && e.reqArray.length && !t.targets[e.name].isRequest) {
                t.targets[e.name].isRequest = !0;
                var n = e.reqArray[0],
                a = {
                    type: "request",
                    data: n.request
                },
                r = JSON.stringify(a);
                t.targets[e.name].send(r)
            }
        },
        request: function(e) {
            var t = this,
            n = $.Deferred();
            return t.reqArray.push({
                defer: n,
                request: e
            }),
            t.next(),
            n
        }
    }),
    function(e, t) {
        return n[e] ? n[e] : n[e] = new a(e, t)
    }
}),
define("xd/Trans",
function(require) {
    var e = $.EventEmitter,
    t = require("xd/crossRequest"),
    n = require("common/env"),
    a = !1,
    r = e.extend({
        initialize: function(e) {
            var r = {
                url: "",
                type: "get",
                dataType: "json",
                args: {}
            };
            $.extend(r, e),
            r.url = n.fixedUrl(r.url),
            r.method = r.type;
            var o = this;
            if (o.opt = r, !a) {
                var i = n.fixedUrl($.parseURL(r.url).host);
                n.isSameDomain(i) ? o.isSame = !0 : o.crossRequest = t(i)
            }
        },
        request: function(e) {
            var t = this,
            n = t.opt;
            return $.extend(n.args, e),
            n.data = n.args,
            a || t.isSame ? $.ajax(n) : this.crossRequest.request(n)
        }
    });
    return r
}),
define("common/pushMessage",
function(require) {
    return function(e) {
        var t = $.env.fixedUrl("//ajax.lianjia.com/ajax/user/favorite/getnotifynum/"),
        n = {
            house_showing: {
                url: "//user.lianjia.com/site/seeSchedule",
                text: '你的看房日程有<span class="unreadNumber">#{unread}</span>条更新'
            },
            community_new_house_source: {
                url: "//user.lianjia.com/?filter=3",
                text: '你关注的小区有<span class="unreadNumber">#{unread}</span>条新上'
            },
            deal: {
                url: "//user.lianjia.com/?filter=1",
                text: '你关注的房源有<span class="unreadNumber">#{unread}</span>条成交'
            },
            price_changed: {
                url: "//user.lianjia.com/?filter=2",
                text: '你关注的房源有<span class="unreadNumber">#{unread}</span>条变价'
            },
            "search:new": {
                url: "//user.lianjia.com/?filter=4",
                text: '你保存的搜索条件有<span class="unreadNumber">#{unread}</span>条变动'
            },
            on_answer_insert_concern: {
                url: "//user.lianjia.com/site/myWenda/?filter=1",
                text: '您关注的问题有<span class="unreadNumber">#{unread}</span>条回复'
            },
            on_answer_insert: {
                url: "//user.lianjia.com/site/myWenda/",
                text: '您提问的问题有<span class="unreadNumber">#{unread}</span>条回复'
            },
            on_extra_answer_pass: {
                url: "//user.lianjia.com/site/myWenda/?filter=2",
                text: '您收到<span class="unreadNumber">#{unread}</span>条新追答'
            },
            on_special_question_pass: {
                url: "//user.lianjia.com/site/myWenda/?filter=3",
                text: '您收到<span class="unreadNumber">#{unread}</span>条定向提问'
            },
            on_extra_question_pass: {
                url: "//user.lianjia.com/site/myWenda/?filter=4",
                text: '您收到<span class="unreadNumber">#{unread}</span>条追问'
            },
            xuequ_bbs: {
                url: "//user.lianjia.com/site/bbs?type=4",
                text: '论坛有<span class="unreadNumber">#{unread}</span>条回复'
            },
            ting_shou: {
                url: "//user.lianjia.com/",
                text: '您关注的<span class="unreadNumber">#{unread}</span>套房源已下架'
            }
        },
        a = $.extend({},
        n, {
            on_extra_answer_pass: {
                url: "//agent.lianjia.com/preference/wenda/?filter=2",
                text: '您收到<span class="unreadNumber">#{unread}</span>条新追答'
            },
            on_special_question_pass: {
                url: "//agent.lianjia.com/preference/wenda/?filter=3",
                text: '您收到<span class="unreadNumber">#{unread}</span>条定向提问'
            },
            on_extra_question_pass: {
                url: "//agent.lianjia.com/preference/wenda/?filter=4",
                text: '您收到<span class="unreadNumber">#{unread}</span>条追问'
            }
        });
        $.ajax({
            url: t,
            type: "get",
            dataType: "jsonp",
            success: function(t) {
                if (0 === t.errno) {
                    var r = t.data.is_agent ? a: n,
                    o = 0;
                    for (var i in t.data.group_by_type) 0 !== t.data.group_by_type[i].unread && r.hasOwnProperty(i) && (o += t.data.group_by_type[i].unread);
                    0 !== o && (e.tipContainer.html(e.tipTpl.render({
                        unreadNum: o
                    })), e.container.html(e.msgTpl.render({
                        group_by_type: t.data.group_by_type,
                        pushMsgMap: r
                    })))
                }
            }
        })
    }
}),
define("common/login",
function() {
    function e() {
        "test" == $.env.getEnv() ? lianjiaCasManager.config({
            setLoginUrl: $.env.fixedUrl("//login.lianjia.com/login/getUserInfo/"),
            service: location.href,
            getFirstTicket: "//passport.off.lianjia.com/cas/prelogin/loginTicket",
            loginUrl: "//passport.off.lianjia.com/cas/login"
        }) : lianjiaCasManager.config({
            setLoginUrl: $.env.fixedUrl("//login.lianjia.com/login/getUserInfo/"),
            service: location.href
        }),
        l && l()
    }
    function t(e) {
        lianjiaCasManager ? e() : l = e
    }
    function n() {
        if (!c) {
            c = !0;
            var t = document.createElement("script");
            "test" == $.env.getEnv() ? t.src = "//passport.off.lianjia.com/cas/js/passport.js": "dev" === s ? t.src = "//passport.lianjia.com:8088/cas/js/passport.js": t.src = "https://passport.lianjia.com/cas/js/passport.js",
            t.type = "text/javascript",
            t.charset = "utf-8",
            t.onload = e,
            document.getElementsByTagName("head")[0].appendChild(t)
        }
    }
    function a() {
        return $ULOG.send("10225"),
        className = $(this).attr("class"),
        $(".overlay_bg").fadeIn(300),
        $(".panel_login").removeAttr("class").addClass("panel_login animated " + className).fadeIn(),
        $("body").css({
            overflow: "hidden"
        }),
        n(),
        !1
    }
    function r() {
        var e = new $.Trans({
            url: $.env.fixedUrl("//login.lianjia.com/login/getUserInfo/"),
            type: "jsonp"
        });
        e.request().done(function(e) {
            e && e.username && (e.code = 1),
            $.listener.trigger("userInfo", e)
        }).fail(function(e) {
            e && $.listener.trigger("userInfo", e.data)
        })
    }
    function o(e) {
        var t = require("common/pushMessage");
        t({
            container: $("#userNews"),
            msgTpl: $.template($("#News").html()),
            tipContainer: $("#indexTipContainer"),
            tipTpl: $.template('<span class="login_bubble_tip"><%=unreadNum%></span>')
        })
    }
    var i, s = require("common/env"),
    c = (require("xd/Trans"), !1),
    l = !1,
    s = $.env.getEnv();
    return i = "test" === s ? "//passport.off.lianjia.com/cas/captcha.htm": "dev" === s ? "//passport.lianjia.com:8088/cas/captcha.htm": "//passport.lianjia.com/cas/captcha.htm",
    $(document.body).ready(function() {
        function e() {
            $(".panel_login").fadeOut(),
            $(".overlay_bg").fadeOut(),
            $("body").css({
                overflow: ""
            }),
            $("#dialog").removeClass("bounceIn")
        }
        function n(e) {
            e = e || "用户名或者密码错误",
            s.find("dd").html(e),
            s.show()
        }
        function r() {
            s.hide()
        }
        var o = $(".verImg"),
        s = $("#con_login_user").find(".show-error");
        o.on("click",
        function() {
            var e = +new Date;
            $(this).attr("src", i + "?t=" + e)
        }),
        $(".typeUserInfo").delegate(".btn-login", "click", a),
        $(".overlay_bg,.claseDialogBtn").click(function() {
            e()
        }),
        $("#con_login_user").delegate("input", "keyup",
        function(e) {
            13 == e.keyCode && $(".login-user-btn").click()
        }),
        $(".login-user-btn").on("click",
        function(e) {
            $ULOG.send("10226");
            var a = $("#con_login_user").find(".item"),
            i = ($("#con_login_agent").find(".item"), a.find(".users").val()),
            s = a.find(".password").val();
            if (!i) return void a.find(".users").focus();
            if (!s) return void a.find(".password").focus();
            var c = $("#con_login_user").find('[name="remember"]').get(0),
            l = {
                username: i,
                password: s,
                code: ""
            };
            if (c && c.checked && (l.remember = 1), "none" != $(".checkVerimg").css("display")) {
                var u = $(".ver-img").val();
                if (!/^\d{4}$/.test(u)) return n("验证码格式错误"),
                void $(".ver-img").focus();
                l.code = u
            }
            r(),
            $.ajax({
                url: $.env.fixedUrl("//bj.lianjia.com/api/checkuserbeforelogin"),
                type: "get",
                dataType: "jsonp",
                data: {
                    mobile: l.username
                }
            }).done(function(e) {
                1 === e.code ? t(function() {
                    lianjiaCasManager.login(l,
                    function(e) {
                        e.code == -1 ? n() : ($.listener.trigger("loginActSuccess"), window.NOTAUTOJUMP || location.reload())
                    },
                    function(e) {
                        1 === e.code ? n() : 2 === e.code ? (n("请输入验证码"), $(".checkVerimg").show(), o.trigger("click")) : 3 === e.code && (n("验证码输入错误"), $(".checkVerimg").show(), o.trigger("click"))
                    })
                }) : n(e.msg)
            })
        })
    }),
    {
        init: function() {
            function e(e) {
                var t = $(".typeUserInfo");
                e && e.username && (e.username = $.encodeHTML($.getLimitString(e.username, 20, ".."))),
                t.each(function() {
                    var t = $(this),
                    n = t.find(".template").html();
                    if (n) {
                        n = $.template(n);
                        var a = $.trim(n.render({
                            data: e
                        }));
                        t.find(".typeShowUser").html(a)
                    }
                })
            }
            $.listener.on("userInfo",
            function(t) {
                e(t),
                t.username && o($(".typeUserInfo").find(".typeShowUser a").eq(0))
            }),
            r()
        },
        openLoginDialog: a
    }
}),
define("common/scrollCaller",
function(require) {
    function e() {
        for (var e = i.scrollTop(), t = s.length - 1; t >= 0; t--) try {
            s[t].call(i, e)
        } catch(e) {
            console.error && console.error(e.stack)
        }
    }
    function t() {
        o && clearTimeout(o),
        o = setTimeout(function() {
            e()
        },
        30)
    }
    function n(e) {
        e ? i.scroll(t) : i.unbind("scroll", t)
    }
    function a(e) {
        s.length || n(!0),
        s.push(e)
    }
    function r(e) {
        var t = $.inArray(e, s);
        t >= 0 && s.splice(t, 1),
        s.length || n(!1)
    }
    var o = !1,
    i = $(window),
    s = [];
    return function(e) {
        if (!e) throw "fun is required";
        return a(e),
        {
            destroy: function() {
                r(e)
            }
        }
    }
}),
define("common/lazyExecute",
function(require) {
    function e(e) {
        for (var n, a = !1,
        r = i.width(), s = window.innerHeight, c = 0, l = o.length; c < l; c++) n = o[c],
        a = t(n, e, r, s),
        a && !n.always && --n.times <= 0 && (o.splice(c, 1), l--, c--)
    }
    function t(e, t, n, a) {
        var r = $(e.el);
        t || (t = document.documentElement.scrollTop || document.body.scrollTop),
        n || (n = i.width()),
        a || (a = window.innerHeight);
        var o = r.offset(),
        s = o.top - e.marginTop,
        c = s + r.height() + e.marginBottom,
        l = t,
        u = t + a;
        return ! (c < l || s > u) && (e.callback && e.callback(), !0)
    }
    function n() {
        a = r(function(t) {
            e(t)
        })
    }
    var a, r = require("common/scrollCaller"),
    o = [],
    i = $(window);
    return function(e) {
        var r = {
            el: "",
            marginTop: 0,
            marginBottom: 0,
            times: 1,
            always: !1,
            callback: $.noop
        };
        if ($.extend(r, e), r.el) {
            var i = t(r);
            if (!i || r.always) return o.push(r),
            a || n(),
            {
                destroy: function() {
                    var e = o.indexOf(r);
                    e >= 0 && o.splice(e, 1)
                },
                pause: function() {
                    var e = o.indexOf(r);
                    e >= 0 && o.splice(e, 1)
                },
                resume: function() {
                    var e = o.indexOf(r);
                    e < 0 && o.push(r)
                }
            }
        }
    }
}),
define("common/footer",
function(require) {
    function e() {
        var e = $(".lianjia-link-box .tab");
        $(".link-list div").eq(0).show(),
        $(".link-footer div").eq(0).show(),
        e.delegate("span", "mouseover",
        function(e) {
            var t = $(e.currentTarget),
            n = t.index(),
            a = t.closest(".tab").next(".link-list");
            t.addClass("hover").siblings("span").removeClass("hover"),
            a.find("div").eq(n).show().siblings("div").hide()
        })
    }
    function t() {
        $(document.body).on("mousedown",
        function(e) {
            $(e.target).closest(".hot-sug,.search-txt ul,.del").length || ($(".hot-sug").hide(), h.css({
                height: "35px",
                overflow: "hidden",
                border: "0px",
                background: "none",
                left: "0px",
                top: "0px",
                display: "none"
            }))
        }),
        $("#keyword-box:text").click(function(e) {
            "" == $(this).val() ? $(e.target).next("div").show() : ($("#keyword-box").select(), $(e.target).next("div").show())
        }),
        $("#keyword-box").keydown(function(e) {
            $(e.target).next("div").hide()
        })
    }
    function n() {
        var e = $(".frauds-list .tab");
        $(".link-list div").eq(0).show(),
        e.delegate("span", "click",
        function(e) {
            var t = $(e.currentTarget),
            n = t.index(),
            a = t.closest(".tab").next(".link-list");
            t.addClass("hover").siblings("span").removeClass("hover"),
            a.find("div").eq(n).show().siblings("div").hide()
        })
    }
    function a() {
        var e = $(".hot-sug ul");
        e.eq(0).show(),
        g.click(function() {
            h.css({
                height: "auto",
                overflow: "auto",
                background: "#fff",
                border: "1px solid #ccc",
                left: "-1px",
                top: "-1px",
                display: "block"
            })
        }),
        "ershoufang" == g.attr("actdata") && $(".savesearch").show(),
        h.delegate("li label", "click",
        function(t) {
            var n = $(t.currentTarget),
            a = n.parent("li").index(),
            r = n.attr("actdata");
            r = r.split("=")[1],
            g.text(n.text()),
            g.attr("actdata", r),
            h.css({
                display: "none"
            });
            var o = $.queryToJson(n.attr("actData"));
            o && defaultSuggest.suggestView.model.trans.setArgs(o);
            var i = $(this).attr("formact"),
            s = n.attr("tra"),
            c = n.attr("tips");
            n.closest(".search-txt").find("form").attr({
                action: i,
                target: s
            }),
            n.closest(".search-txt").find("form").attr({
                "data-action": i
            }),
            n.closest(".search-txt").find(".autoSuggest").attr("placeholder", c),
            e.eq(a).show().siblings("ul").hide();
            var l = n.closest(".search-txt").find(".autoSuggest");
            "placeholder" in document.createElement("input") ? l.val("") : l.val(c),
            "ershoufang" == r ? $(".savesearch").show() : $(".savesearch").hide(),
            u()
        })
    }
    function r() {
        var e = $("#back-top");
        if (e.hasClass("fix-right-v2") || e.hasClass("fix-right-v3")) {
            var t = "";
            e.on("mouseenter", "li",
            function() {
                var e = $(this).find(".popup").eq(0);
                t = this.className,
                e.show(),
                e.stop().animate({
                    opacity: "1",
                    right: "38px"
                },
                200)
            }).on("mouseleave", "li",
            function() {
                var e = $(this).find(".popup").eq(0),
                n = this.className;
                t = "",
                e.stop().animate({
                    opacity: "0",
                    right: "48px"
                },
                200,
                function() {
                    n != t && e.hide()
                })
            })
        } else {
            var n = $("#back-top .tips li,#gotop");
            n.mouseenter(function() {
                $(this).find("span").css({
                    opacity: "1"
                }),
                $(this).css({
                    overflow: "inherit",
                    width: "auto"
                })
            }),
            n.mouseleave(function(e) {
                $(this).find("span").css({
                    opacity: "0"
                }),
                $(this).css({
                    overflow: "hidden",
                    width: "37px"
                })
            })
        }
    }
    function o() {
        var e = $(".feedback-box");
        $("#tel").val();
        e.delegate("#sub", "click",
        function() {
            var t = ($("#sub"), $("#tips")),
            n = "//www.lianjia.com/site/accuse/",
            a = ($("#count"), $("#tel").val()),
            r = $("#count").val();
            r = $.trim(r);
            var o = $("#count").attr("placeholder");
            if ("" == r || r == o) return $(".erro-tips").show(),
            !1;
            var i = {
                contact: a,
                content: r
            };
            $.ajax({
                type: "POST",
                url: n,
                dataType: "json",
                data: i,
                xhrFields: {
                    withCredentials: !0
                },
                crossDomain: !0,
                success: function(n) {
                    0 == n.status ? (t.html("反馈成功非常感谢您的反馈！"), e.delay(2e3).fadeOut().removeClass("bounceIn"), v.delay(2e3).fadeOut()) : t.html("反馈失败请重新填写！")
                }
            })
        }),
        e.delegate(".tab span", "click",
        function() {
            $(".complain .tab-box").eq($(this).index()).show().siblings().hide(),
            $(this).addClass("check").siblings().removeClass("check");
        });
        var t = '<li><span class="time">#{issue_time}</span><span class="name">#{customer_name}</span><span class="phone">#{customer_phone}</span><span class="type">#{trade_type}</span><span class="finish">#{issue_status}</span></li>';
        e.delegate(".ent", "click",
        function() {
            $("#tousu .btn-more").attr("href", "//" + window.location.host.split(".").slice( - 3).join(".") + "/report/tousu/");
            var e = ljConf.pageConfig.ajaxroot + "ajax/tousu/GetCityTousuBrief";
            $.ajax({
                url: e,
                dataType: "jsonp",
                data: {
                    city_id: ljConf.city_id
                }
            }).done(function(e) {
                var n = $(".feedback-box #list");
                n.html("");
                var e = e.data;
                if (e.data && e.data.length <= 0 && $("#tousu").hide(), e.data && 0 == e.code) {
                    for (var a = e.data,
                    r = "",
                    o = 0; o < a.length; o++) {
                        var i;
                        i = 1 == a[o].issue_status ? "未处理": 2 == a[o].issue_status ? "处理中": "已完成",
                        r += $.replaceTpl(t, {
                            issue_time: a[o].issue_time,
                            customer_name: a[o].customer_name,
                            customer_phone: a[o].customer_phone,
                            trade_type: a[o].trade_type,
                            issue_status: i
                        })
                    }
                    n.append(r)
                }
            })
        })
    }
    function i() {
        var e = ($("#feedback"), $(".feedback-box"));
        e.fadeOut().removeClass("bounceIn"),
        e.html(m),
        v.fadeOut()
    }
    function s() {
        var e = $("#feedback"),
        t = $(".feedback-box");
        e.click(function(e) {
            t.show(),
            t.addClass("bounceIn"),
            v.fadeIn(300),
            t.html(m)
        }),
        v.click(function(e) {
            i()
        }),
        t.delegate(".closebok", "click",
        function(e) {
            i()
        })
    }
    function c() {
        $("#back-top").on("click", "li",
        function() {
            var e = $(this).find("a").attr("data-url");
            if (e) if (window.loginData && 1 == window.loginData.code) window.open(e);
            else {
                var t = $(".btn-login");
                t.length > 0 ? t.trigger("click") : alert("请登录后使用，谢谢！")
            }
        })
    }
    function l(e, t) {
        searchHis = localStorage.getItem(e),
        searchHis = JSON.parse(searchHis),
        searchHis ? ($.each(searchHis,
        function(e, n) {
            n && n.name == t.name && searchHis.splice(e, 1)
        }), searchHis.unshift(t), saveQuery = searchHis.slice(0, 10)) : saveQuery = [t],
        localStorage.setItem(e, JSON.stringify(saveQuery))
    }
    function u() {
        var e = $(".btn");
        if ($(".search-tab .check").length > 0) {
            var t = $(".search-tab .check").attr("actdata"),
            n = e.attr("daty-id");
            menu = t + n,
            $("#keyword-box").on("formSelect",
            function(e, t) {
                $(this).val($(t).find(".hot-title i").text()),
                url = $(t).attr("actdata"),
                url = url.substring(url.indexOf("&url=") + 5, url.lastIndexOf("&title")),
                url = unescape(url),
                $(this).attr("url", url)
            }),
            e.click(function(e) {
                if ($("#keyword-box").attr("url")) {
                    var t = $("#keyword-box").val(),
                    n = $("#keyword-box").attr("url");
                    query = {
                        name: t,
                        url: n
                    },
                    l(menu, query)
                } else {
                    var a = $(".search-txt form").attr("data-action"),
                    t = $("#keyword-box").val(),
                    n = location.protocol + "//" + window.location.host + a + t;
                    "" != t && (query = {
                        name: t,
                        url: n
                    },
                    l(menu, query))
                }
            });
            var a = $(".hot-sug");
            a.delegate("li a", "click",
            function(e) {
                var t = $(e.currentTarget);
                name = t.text(),
                url = t.attr("href"),
                query = {
                    name: name,
                    url: url
                },
                l(menu, query)
            });
            var r = $("#suggest-cont");
            r.delegate("ul li", "click",
            function(e) {
                var t = $(e.currentTarget);
                name = t.find(".hot-title i").text(),
                url = t.attr("actdata"),
                url = url.substring(url.indexOf("&url=") + 5, url.lastIndexOf("&title")),
                url = unescape(url),
                query = {
                    name: name,
                    url: url
                },
                l(menu, query)
            });
            var o = localStorage.getItem(menu);
            if (o = JSON.parse(o), null != o) {
                $("#keyword-box").val(o[0].name);
                var i = $(".hot-sug ul#" + t + " .list"),
                s = $(".hot-sug ul#" + t + " .hot-name"),
                c = i.html();
                s.text("搜索历史"),
                i.html(""),
                $.each(o,
                function(e, t) {
                    var n = '<li><a href="' + t.url + '" data-log_index="' + (e + 1) + '" data-log_value="' + t.name + '">' + $.encodeHTML(t.name) + "</a></li>";
                    i.append(n)
                });
                var u = $("#" + t + " .del");
                u.show(),
                u.click(function(e) {
                    localStorage.removeItem(menu),
                    i.html(""),
                    i.append(c),
                    s.text("热门搜索"),
                    u.hide(),
                    "" == texval
                })
            }
        }
    }
    function d() {
        var e = (g.attr("actdata"), $(".savesearch"));
        e.length && p({
            el: e,
            callback: function() {
                var e = ljConf.city_id,
                t = new $.ListView({
                    el: ".savesearch",
                    template: "#savesearch",
                    url: $.env.fixedUrl("//ajax.lianjia.com/ajax/user/favorite/getSearchNotifyNum"),
                    type: "jsonp",
                    args: {
                        cityId: e
                    }
                });
                t.showloading = function() {},
                t.init()
            }
        });
        var t = $(".savesearch");
        t.find(".s-show");
        t.delegate(".more", "click",
        function(e) {
            var t = $(e.currentTarget),
            n = t.parent("ul");
            n.find(".list").css({
                height: "auto"
            }),
            t.hide()
        }),
        t.delegate(".s-show", "click",
        function(e) {
            var t = $(e.currentTarget);
            t.next(".cunn").toggle(),
            "none" == t.next(".cunn").css("display") ? t.find("label").removeClass("down") : t.find("label").addClass("down"),
            $(".sug-tips ul").hide()
        }),
        $(".savesearch .s-show").click(function() {}),
        $(document.body).on("mousedown",
        function(e) {
            $(e.target).closest(".savesearch").length || (t.find(".cunn").hide(), t.find("label").removeClass("down"))
        })
    }
    function f() {
        var e = $('[data-role="huodong-btn"]'),
        t = $('[data-role="huodong-mask"]'),
        n = $('[data-role="huodong-layer"]');
        e.length > 0 && (e.click(function() {
            t.fadeIn(500),
            n.addClass("bounceIn").show()
        }), n.click(function(e) {
            var a = $(e.target); (0 == a.closest('[data-role="huodong-wrap"]').length || a.closest(".close").length > 0) && (t.fadeOut(500), n.removeClass("bounceIn").fadeOut())
        }))
    }
    var p = require("common/lazyExecute"),
    h = $(".search-tab .tabs"),
    g = $(".search-tab .check"),
    m = $(".feedback-box").html(),
    v = $(".overlay_bg");
    return {
        init: function(i) {
            u(),
            t(),
            e(),
            a(),
            c(),
            f(),
            s(),
            o(),
            r(),
            d(),
            n()
        }
    }
}),
function() {
    $.listener = new $.EventEmitter(!0),
    $.env = require("common/env"),
    $(document.body).ready(function() {
        function e() {
            setTimeout(function() {
                $(".LOGVIEW:above-the-fold").each(function() {
                    var e = $(this);
                    LjUserTrack.send({
                        typ: "show"
                    },
                    e.get(0)),
                    e.removeClass("LOGVIEW")
                }),
                e()
            },
            100)
        }
        function t() {
            var e = $(document.body);
            e.on("mousedown", ".LOGCLICK",
            function() {
                LjUserTrack.send({
                    typ: ""
                },
                $(this).get(0))
            }),
            $.listener.on("userInfo",
            function(t) {
                e.on("mousedown", ".LOGKEFU",
                function() {
                    LjUserTrack.send({
                        ljweb_mod: "imclick",
                        ljweb_bl: 1 == t.code ? "1": "0",
                        ljweb_el: "BB120",
                        ljweb_group: 1
                    }),
                    LjUserTrack.send({
                        ljweb_mod: "imclick",
                        ljweb_bl: 1 == t.code ? "1": "0",
                        ljweb_el: "BB120",
                        ljweb_group: 1,
                        evt_id: "10190"
                    })
                })
            })
        }
        require("common/login").init();
        var n = $("#only");
        n.attr("data-city") && (n.attr("data-city").indexOf("su") >= 0 || n.attr("data-city").indexOf("jn") >= 0) && ($(".laisuzhou").addClass("laisuzhou-class"), $(document.body).delegate(".laisuzhou", "click",
        function(e) {
            return ! 1
        })),
        require("common/footer").init(),
        e(),
        t(),
        $(window).on("load",
        function() {
            setTimeout(function() {
                window.frames && LjUserTrack.sendId(window.frames.length ? "10285": "10286")
            },
            2e3)
        })
    })
} ();