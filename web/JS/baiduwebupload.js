function initwebupload(picbtn, piclist, limit) {
    var $ = jQuery,
        $list = $('#' + piclist);
    // 优化retina, 在retina下这个值是2
    var ratio = window.devicePixelRatio || 1;


    // 缩略图大小
    var thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio,

    // Web Uploader实例
        uploader;



    // 初始化Web Uploader
    uploader = WebUploader.create({

        // 选完文件后，是否自动上传。
        auto: true,

        swf: '/JS/baiduupload/Uploader.swf',

        // 文件接收服务端。
        server: '../../ImgUpload.ashx?action=fileupload&savepath=~/Cache/',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: { id: '#' + picbtn, innerHTML: '<span  id="lbluoload">上传</span>' },

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
        //fileNumLimit:(limit>0?limit:100)
    });





    uploader.on('fileQueued', function (file) {

        if (limit > 0) {
            if ($("#" + piclist + " .file-item").length + 1 > limit) {
                alert("最多只能上传" + limit + "个");
                return false;
            }

        }


        var $li = $(
            '<div id="' + file.id + '" class="file-item uploadimages" style="margin-left:5px;margin-bottom:5px">' +
                '<img>' +
            '</div>'
            ),
        $img = $li.find('img');


        // $list为容器jQuery实例
        $list.append($li);

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb(file, function (error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);
    });



    uploader.on('uploadProgress', function (file, percentage) {
        //ShowLoading("上传中...");
        var $li = $('#' + file.id),
        $percent = $li.find('.progress span');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo($li)
                .find('span');
        }

        $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file, response) {
        //HideLoading();
        //console.log(response._raw)
        $('#' + file.id).attr("imageurl", response._raw)
        $('#' + file.id).addClass('upload-state-done');
    });

    // 文件上传失败，显示上传出错。
    uploader.on('uploadError', function (file, reason, reason1) {
        // HideLoading();
        alert("上传失败")
        var $li = $('#' + file.id),
        $error = $li.find('div.error');

        // 避免重复创建
        if (!$error.length) {
            $error = $('<div class="error"></div>').appendTo($li);
        }

        $error.text('上传失败');
    });


    uploader.on("error", function (type) {
        if (type == "Q_TYPE_DENIED") {
            layer.msg("请上传JPG、PNG、GIF、BMP格式文件");
        } else if (type == "Q_EXCEED_SIZE_LIMIT") {
            layer.msg("文件大小不能超过2M");
        } else {
            layer.msg("上传出错！请检查后重新上传！错误代码" + type);
        }
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').remove();
    });

    $("#" + piclist + " .uploadimages").live("click", function () {
        var obj = $(this);

        if (confirm("确认删除?"))
        { obj.remove(); }

    })
}