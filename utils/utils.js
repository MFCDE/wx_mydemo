/**
 * 将时间new Date()转换成'年-月-日'格式的字符串时间格式
 * @param date
 * @returns {string}
 */
function formatDate(date) {
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
}

/**
 * 计算两个时间之间相差天数
 * @param 开始时间
 * @param 最新时间
 * @returns {number}
 */
function dayDiff(time1, time2) {
    // var time1 = arguments[0],
    //     time2 = arguments[1];
    time1 = Date.parse(time1) / 1000;
    time2 = Date.parse(time2) / 1000;
    var time_ = time2 - time1;
    return (time_ / (3600 * 24));
}

/**
 * 字符串截取函数,超过规定长度的用...代替
 * @param str
 * @param length
 * @param start
 * @returns {*}
 */
function mubstr(str, length, start = 0) {
    if (str.length > length) {
        return str.substr(start, length) + '...';
    } else {
        return str;
    }
}

/**
 * 微信的request请求
 * @param {请求地址} url
 * @param {success里的回调函数} callBack
 */
function http(url, callBack) {
    wx.request({
        url: url,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        header: {
            'Content-Type': 'application/json'
        },
        success: function (res) {
            callBack(res.data);
        },
        fail: function () {
            // fail
        },
        complete: function () {
            // complete
        }
    })
}

/**
 *
 *把数字转换成[1,0....]这种形式数组
 * @param {数字形式的整形或字符串} stars
 * @param {一共多少星级} length
 */
function convertToStarsArray(stars, length = 5) {
    var num = stars.toString().substring(0, 1);
    var arr = [];
    for (var i = 1; i <= length; i++) {
        if (i <= num) {
            arr.push(1);
        } else {
            arr.push(0);
        }
    }

    return arr;
}

/**
 * 拼接电影详情数据演员信息
 * 将数组里数据的name值拼接成"name / name形式的字符串"
 * @param casts
 */
function convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
        castsjoin += casts[idx].name + " / ";
    }

    //去除最后一个"/ "
    return castsjoin.substring(0, castsjoin.length - 2);
}

/**
 * 拼接一个含有演员图片和演员信息对象的数组
 * @param casts
 */
function convertToCastInfos(casts) {
    var castArray = [];
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name
        };

        castArray.push(cast);
    }

    return castArray;
}

module.exports = {
    convertToStarsArray: convertToStarsArray,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos,
    formatDate: formatDate,
    dayDiff: dayDiff,
    mubstr: mubstr,
    http: http
};