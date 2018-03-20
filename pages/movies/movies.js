var app = getApp();

Page({
    data: {
        readyData:[]
    },
    onLoad: function (options) {
        var that = this;
        // 生命周期函数--监听页面加载
        var inTeaters={};
        var comingSoon={};
        var top250 = {};

        inTeaters.url = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
        inTeaters.key = "theaters";
        comingSoon.url = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
        comingSoon.key = "comingSoon";
        top250.url = app.globalData.g_doubanBase + "/v2/movie/top250";
        top250.key = "top250";

        inTeaters.data = wx.getStorageSync('theaters');
        comingSoon.data = wx.getStorageSync('comingSoon');
        top250.data = wx.getStorageSync('top250');

        that.readyData = [];

        that.assignData(inTeaters);
        that.assignData(comingSoon);
        that.assignData(top250);

        that.setData({
            moviesList: that.readyData
        });

        console.log(that.readyData);
        

        // wx.request({
        //     url: 'http://t.yushu.im/v2/movie/top250',
        //     data: {},
        //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     header: {
        //         'Content-Type': 'application/json'
        //     }, // 设置请求的 header
        //     success: function (res) {
        //         // console.log(res);
        //         console.log(res.data.subjects);
        //         var data = res.data.subjects[0];
        //         that.setData({moviesList:data});
        //     },
        //     fail: function () {
        //         // fail
        //     },
        //     complete: function () {
        //         // complete
        //     }
        // })
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    },
    assignData: function (douban) {
        var that = this;
        var date = app.formatDate(new Date());

        if (!douban.data) {
            that.getMovieListData(douban, date);
        } else {
            var lastDate = douban.time;
            var nowDate = app.formatDate(new Date());

            var day = app.dayDiff(lastDate, nowDate);

            if (day > 0) {
                that.getMovieListData(douban, nowDate);
            } else {
                that.readyData[douban.key] = douban.data;
            }
        }
    },
    //获取电影数据
    getMovieListData: function (douban, time) {
        var that = this;
        wx.request({
            url: douban.url,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'Content-Type': 'application/json'
            }, // 设置请求的 header
            success: function (res) {
                // console.log(res);
                console.log(res.data.subjects);
                var data = res.data.subjects[0];

                that.readyData[douban.key] = data;

                wx.setStorageSync(douban.key, {
                    movies: data,
                    time: time
                });
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        });
    }
})