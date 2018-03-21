var app = getApp();

Page({
    data: {
        readyData: {}
    },
    onLoad: function (options) {
        var that = this;
        // 生命周期函数--监听页面加载
        var inTeaters = {};
        var comingSoon = {};
        var top250 = {};

        inTeaters.url = app.globalData.g_doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        inTeaters.key = "theaters";
        comingSoon.url = app.globalData.g_doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        comingSoon.key = "comingSoon";
        top250.url = app.globalData.g_doubanBase + "/v2/movie/top250?" + "start=0&count=3";
        top250.key = "top250";

        inTeaters.data = wx.getStorageSync('theaters').movies;
        comingSoon.data = wx.getStorageSync('comingSoon').movies;
        top250.data = wx.getStorageSync('top250').movies;

        that.assignData(inTeaters);
        that.assignData(comingSoon);
        that.assignData(top250);

        //不能写在这里，assignData()里是有异步方法的，必须放到异步成功后的回调函数里
        // that.setData(
        //     that.data.readyData
        // );

        console.log(that.data.readyData);


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
    /**
     * douban
     */
    assignData: function (douban,updataDay = 0) {
        var that = this;
        var date = app.formatDate(new Date());

        if (!douban.data) {
            that.getMovieListData(douban, date);
        } else {
            var lastDate = douban.time;
            var nowDate = app.formatDate(new Date());

            var day = app.dayDiff(lastDate, nowDate);

            if (updataDay > 0) {
                that.getMovieListData(douban, nowDate);
            } else {
                that.data.readyData[douban.key] = {
                    movies: douban.data
                };
                that.setData(that.data.readyData);
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
                that.processDoubanData(res.data, douban, time);
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        });
    },
    processDoubanData: function (moviesDouban, douban, time) {
        var that = this;
        console.log(moviesDouban.subjects);

        //重组成需要都豆瓣电影数据，只需要图片、标题
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = app.mubstr(subject.title, 5);

            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }

            movies.push(temp);
        }

        //这个douban.key相当于readyData的属性，可以用数组写法实现对象的形式
        that.data.readyData[douban.key] = {
            movies: movies
        };

        that.setData(
            //这里不会覆盖不同的，相当与在data里展开
            that.data.readyData
        );

        wx.setStorageSync(douban.key, {
            movies: movies,
            time: time
        });
    },
})