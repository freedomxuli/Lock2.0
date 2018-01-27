<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Register.aspx.cs" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Cache-Control" content="no-transform" />
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <meta http-equiv="Content-language" content="zh-CN" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="applicable-device" content="pc" />
    <meta name="mobile-agent" content="format=html5;" />

    <title>智宿网络科技</title>
    <meta name="description" content="智宿网络科技" />
    <meta name="keywords" content="常州二手房网,常州租房网,常州房产,智宿网络科技" />
    <base target="_blank" />
    <link href="/favicon.ico" type="image/x-icon" rel="icon" />
    <link href="/favicon.ico" type="image/x-icon" rel="shortcut icon" />
    <link rel="stylesheet" href="../css/common.css" />
    <link rel="stylesheet" href="../css/Register.css" />
    <link rel="stylesheet" href="../css/login.css" />
    <link rel="stylesheet" href="../js/jDialog/jDialog.css" type="text/css" />
    <%--<script src="../Resource/js/base/jquery-3.2.1.min.js"></script>--%>
    <script src="../js/base/jquery-1.7.2.min.js"></script>
    <link href="../css/IMGUP.css" rel="stylesheet" />
    <script type="text/javascript" src="../JS/jDialog.js"></script>
    <!--[if lt IE 9]><script type="text/javascript" src="js/html5.js?_v=20150514201547"></script><![endif]-->
    <script type="text/javascript">
        $(function () {
            $("#showT").hide();
            $(".actSubmit").click(function () {
                CheckInput();
                //CheckCode();
            });
            $("#sendM").click(function () {
                if ($("input[name='mobile']").val() == "" || $("input[name='mobile']").val() == null) {
                    jDialog.alert('手机号不能为空！', {}, {
                        showShadow: false,// 不显示对话框阴影
                        buttonAlign: 'center',
                        events: {
                            show: function (evt) {
                                var dlg = evt.data.dialog;
                            },
                            close: function (evt) {
                                var dlg = evt.data.dialog;
                            },
                            enterKey: function (evt) {
                                alert('enter key pressed!');
                            },
                            escKey: function (evt) {
                                alert('esc key pressed!');
                                evt.data.dialog.close();
                            }
                        }
                    });
                    return;
                }
                var pattern = /^1[34578]\d{9}$/;
                if (!pattern.test($("input[name='mobile']").val())) {
                    jDialog.alert('手机号必须正确！', {}, {
                        showShadow: false,// 不显示对话框阴影
                        buttonAlign: 'center',
                        events: {
                            show: function (evt) {
                                var dlg = evt.data.dialog;
                            },
                            close: function (evt) {
                                var dlg = evt.data.dialog;
                            },
                            enterKey: function (evt) {
                                alert('enter key pressed!');
                            },
                            escKey: function (evt) {
                                alert('esc key pressed!');
                                evt.data.dialog.close();
                            }
                        }
                    });
                    return;
                }
                $(this).hide();
                $("#showT").show();
                getmess();
                sendmessage($("input[name='mobile']").val());
                var dialog = jDialog.alert('短信发送成功,请在20分钟内填写收到的验证码！', {}, {
                    showShadow: false,// 不显示对话框阴影
                    buttonAlign: 'center',
                    events: {
                        show: function (evt) {
                            var dlg = evt.data.dialog;
                        },
                        close: function (evt) {
                            var dlg = evt.data.dialog;
                        },
                        enterKey: function (evt) {
                            alert('enter key pressed!');
                        },
                        escKey: function (evt) {
                            alert('esc key pressed!');
                            evt.data.dialog.close();
                        }
                    }
                });
            });
            var timer = 600;
            function getmess() {
                var flag = setInterval(function () {
                    timer--;
                    $("#showT").html(timer + "s");
                    if (timer == 0) {
                        $("#showT").hide();
                        $("#sendM").show();
                        $("#showT").html("10s");
                        timer = 600;
                        clearInterval(flag);
                    }
                }, 1000)
            }
            function sendmessage(mobileNum) {
                $.ajax({
                    url: "../Method/Register.ashx",
                    data: {
                        method: "AddCode",
                        mobile: mobileNum
                    },
                    type: "post",
                    datatype: "json",
                    success: function (data) {
                        $.ajax({
                            url: "../Method/Register.ashx",
                            data: {
                                method: "message",
                                mobile: mobileNum,
                                sms: "【e家智宿】验证码：" + data
                            },
                            type: "post",
                            datatype: "json",
                            success: function (data) {
                                //console.log(data);
                            },
                            error: function (data) {
                                //console.log(1);
                            }
                        });
                    },
                    error: function (data) {
                        //console.log(1);
                    }
                });
            }
            function CheckInput() {
                if ($("#pw").val() == "" || $("#pw").val() == null) {
                    jDialog.alert('密码不能为空！', {}, {
                        showShadow: false,// 不显示对话框阴影
                        buttonAlign: 'center',
                        events: {
                            show: function (evt) {
                                var dlg = evt.data.dialog;
                            },
                            close: function (evt) {
                                var dlg = evt.data.dialog;
                            },
                            enterKey: function (evt) {
                                alert('enter key pressed!');
                            },
                            escKey: function (evt) {
                                alert('esc key pressed!');
                                evt.data.dialog.close();
                            }
                        }
                    });
                    return;
                }
                CheckCode();
            }
            function CheckCode() {
                $.ajax({
                    url: "../Method/Register.ashx",
                    data: {
                        method: "GetCode",
                        mobile: $("input[name='mobile']").val(),
                        code: $("input[name='verifyCode']").val()
                    },
                    type: "post",
                    datatype: "json",
                    success: function (data) {
                        if (data == 1) {
                            jDialog.alert('请填写收到的验证码！', {}, {
                                showShadow: false,// 不显示对话框阴影
                                buttonAlign: 'center',
                                events: {
                                    show: function (evt) {
                                        var dlg = evt.data.dialog;
                                    },
                                    close: function (evt) {
                                        var dlg = evt.data.dialog;
                                    },
                                    enterKey: function (evt) {
                                        alert('enter key pressed!');
                                    },
                                    escKey: function (evt) {
                                        alert('esc key pressed!');
                                        evt.data.dialog.close();
                                    }
                                }
                            });
                            return;
                        } else if (data == 2) {
                            jDialog.alert('对不起，您的验证码已过期，请重新获取！', {}, {
                                showShadow: false,// 不显示对话框阴影
                                buttonAlign: 'center',
                                events: {
                                    show: function (evt) {
                                        var dlg = evt.data.dialog;
                                    },
                                    close: function (evt) {
                                        var dlg = evt.data.dialog;
                                    },
                                    enterKey: function (evt) {
                                        alert('enter key pressed!');
                                    },
                                    escKey: function (evt) {
                                        alert('esc key pressed!');
                                        evt.data.dialog.close();
                                    }
                                }
                            });
                            return;
                        } else if (data == 3) {
                            jDialog.alert('对不起，您的验证码不正确！', {}, {
                                showShadow: false,// 不显示对话框阴影
                                buttonAlign: 'center',
                                events: {
                                    show: function (evt) {
                                        var dlg = evt.data.dialog;
                                    },
                                    close: function (evt) {
                                        var dlg = evt.data.dialog;
                                    },
                                    enterKey: function (evt) {
                                        alert('enter key pressed!');
                                    },
                                    escKey: function (evt) {
                                        alert('esc key pressed!');
                                        evt.data.dialog.close();
                                    }
                                }
                            });
                            return;
                        } else {

                            $.ajax({
                                url: "../Method/Register.ashx",
                                data: {
                                    method: "ModifyPwd",
                                    mobile: $("input[name='mobile']").val(),
                                    pw: $("#pw").val()
                                   
                                },
                                type: "post",
                                datatype: "json",
                                success: function (data) {
                                    jDialog.alert('修改成功！', {}, {
                                        showShadow: false,// 不显示对话框阴影
                                        buttonAlign: 'center',
                                        events: {
                                            show: function (evt) {
                                                var dlg = evt.data.dialog;
                                            },
                                            close: function (evt) {
                                                window.location.href = "../Login.aspx";
                                            },
                                            enterKey: function (evt) {
                                                alert('enter key pressed!');
                                            },
                                            escKey: function (evt) {
                                                alert('esc key pressed!');
                                                evt.data.dialog.close();
                                            }
                                        }
                                    });
                                },
                                error: function (data) {
                                    //console.log(1);
                                }
                            });

                        }
                    },
                    error: function (data) {
                        //console.log(1);
                    }
                });
            }
        });
    </script>
</head>
<body>
    <div class="user-login">
        <div class="headerBox">
            <%--<img src="./images/logo.png" class="headerLogo">--%>
            <a href="../Login.aspx" class="gotoIndex">返回登录页</a>
        </div>
        <div class="wrapper">
            <h1>修改密码</h1>
            <div class="guideBox">
                <%--<a href="https://passport.lianjia.com/cas/loginmas" id="loginUrl">已有账号，去登录</a>--%>
            </div>
            <div class="reset-pwd registerred">
                <form id="registerForm" target="_self">
                    <input type="hidden" name="redirect" id="r" value="" />
                    <ul>
                        <li class="">
                            <input type="text" name="mobile" placeholder="请输入手机号" validate="notNull,isTel" validatename="手机号" class="phonecode basisyle inputText topSpecial" />
                            <div class="send" id="sendM">发送验证码</div>
                            <div class="send" id="showT">600s</div>
                        </li>
                        <li>
                            <input type="text" placeholder="请输入短信验证码" name="verifyCode" class="actCheckVerify basisyle inputText" validatename="短信验证码" maxlength="6" validate="notNull" />
                        </li>

                        <li>
                            <input type="password" id="pw" placeholder="请输入密码" class="basisyle inputText" />
                        </li>

                        <li>
                            <input type="button" value="确定" class="up-pwd actSubmit btnStyle basisyle" />
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    </div>
    <div class="lianjia-footer-reg">智宿网络科技有限公司保留全部权利&nbsp;</div>

    <div id="only" data-city="login" data-page="login_register"></div>

    <script type="text/javascript" src="../js/base/city.js"></script>
    <script src="../js/IMGUP.js"></script>
</body>
</html>
