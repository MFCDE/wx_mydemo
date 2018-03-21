App({
    globalData: {
        g_isPlayingMusic: false,
        g_currentMusicPostId: null,
        g_doubanBase: "http://t.yushu.im"
    },
    onLaunch: function () {},
    onShow: function () {},
    onHide: function () {},
    onError: function (msg) {},
    //将时间new Date()转换成'年-月-日'格式的字符串时间格式
    formatDate: function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var nowDate = year + "-" + month + "-" + day;

        return nowDate;
    },
    //计算两个时间之间相差天数
    dayDiff: function (time1, time2) {
        // var time1 = arguments[0],
        //     time2 = arguments[1];
        time1 = Date.parse(time1) / 1000;
        time2 = Date.parse(time2) / 1000;
        var time_ = time2 - time1;
        return (time_ / (3600 * 24));
    },
    /**
     * 字符串截取函数,超过规定长度的用...代替
     */
    mubstr: function (str, length, start = 0) {
        if (str.length > length) {
            return str.substr(start, length) + '...';
        } else {
            return str;
        }
    }
})