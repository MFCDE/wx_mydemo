var util = require('../../utils/utils.js');
var app = getApp();

Page({
    data: {
        // readyData: {}
        searchResult: {},
        inTeaters: {},
        comingSoon: {},
        top250: {},
        containerShow: true,
        searchPanelShow: false
    },
    onLoad: function (options) {
        var that = this;
        // 生命周期函数--监听页面加载

        that.data.inTeaters.url = app.globalData.g_doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        that.data.inTeaters.key = "theaters";
        that.data.inTeaters.category = '正在热映';
        that.data.comingSoon.url = app.globalData.g_doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        that.data.comingSoon.key = "comingSoon";
        that.data.comingSoon.category = '即将上映';
        that.data.top250.url = app.globalData.g_doubanBase + "/v2/movie/top250?" + "start=0&count=3";
        that.data.top250.key = "top250";
        that.data.top250.category = 'Top250';

        that.data.inTeaters.data = wx.getStorageSync('theaters').movies;
        that.data.comingSoon.data = wx.getStorageSync('comingSoon').movies;
        that.data.top250.data = wx.getStorageSync('top250').movies;

        that.assignData(that.data.inTeaters);
        that.assignData(that.data.comingSoon);
        that.assignData(that.data.top250);

        //不能写在这里，assignData()里是有异步方法的，必须放到异步成功后的回调函数里
        // that.setData(
        //     that.data.readyData
        // );

        console.log(that.data);

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
    }
    ,
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    }
    ,
    onShow: function () {
        // 生命周期函数--监听页面显示
    }
    ,
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    }
    ,
    onUnload: function () {
        // 生命周期函数--监听页面卸载
    }
    ,
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
    }
    ,
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    }
    ,
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    }
    ,
    /**
     * douban
     */
    assignData: function (douban, updataDay = 0) {
        var that = this;
        var date = util.formatDate(new Date());

        if (!douban.data) {
            //如果缓存里没有数据则去请求数据
            that.getMovieListData(douban, date);
        } else {
            var lastDate = douban.time;
            var nowDate = util.formatDate(new Date());

            var day = util.dayDiff(lastDate, nowDate);
            //如果超过1天（这里1天不是24小时是日期）则重新获取数据
            if (updataDay > 0) {
                that.getMovieListData(douban, nowDate);
            } else {
                //不超过一天从缓存里获取数据
                // that.data.readyData[douban.key] = {
                //     movies: douban.data
                // };
                // that.setData(that.data.readyData);

                //不超过一天从缓存里获取数据
                var readyDate = {};
                readyDate[douban.key] = {
                    movies: douban.data,
                    category: douban.category
                };
                that.setData(readyDate);
            }
        }
    }
    ,
//获取电影数据
    getMovieListData: function (douban, time) {
        var that = this;
        // util.http(douban.url, that.processDoubanData);
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
    }
    ,
    processDoubanData: function (moviesDouban, douban, time) {
        var that = this;
        console.log(moviesDouban.subjects);

        //重组成需要都豆瓣电影数据，只需要图片、标题
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            //标题长度超过5用...替代
            var title = util.mubstr(subject.title, 5);
            //将星星转换成数组形式
            var stars = util.convertToStarsArray(subject.rating.stars);

            //页面需要绑定的数据
            var temp = {
                title: title,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                rating: {
                    stars: stars,
                    average: subject.rating.average,
                }
            }

            movies.push(temp);
        }

        //这个douban.key相当于readyData的属性，可以用数组写法实现对象的形式
        // that.data.readyData[douban.key] = {
        //     movies: movies
        // };

        //这个douban.key相当于readyData的属性，可以用数组写法实现对象的形式
        var readyDate = {};
        readyDate[douban.key] = {
            movies: movies,
            category: douban.category
        };

        that.setData(
            //这里不会覆盖不同的，相当与在data里展开
            // that.data.readyData
            readyDate
        );

        wx.setStorageSync(douban.key, {
            movies: movies,
            category: douban.category,
            time: time
        });
    },
    //点击跳转到更多页面
    onMoreTap: function (event) {
        //得到data-参数
        var category = event.currentTarget.dataset.category;

        //跳转到子页面，传递category，在move-more页面接收
        wx.navigateTo({
            //注意=两边不要有空格
            url: "more-movie/more-movie?category=" + category
        });
    },
    //点击跳转到电影详情页
    onMovieTap: function (event) {
        var movieid = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '/pages/movies/movie-detail/movie-detail?id=' + movieid
        })
    },
//隐藏搜索界面
    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {}
        })
    }
    ,
//光标触发显示搜索界面
    onBindFocus: function (event) {
        //this.data.onShow = true;
        // this.setData({yoo:true});
        this.setData({
            containerShow: false,
            searchPanelShow: true
        });
    }
    ,
//搜索内容改变事件
    onBindChange: function (event) {
        var text = event.detail.value;
        this.searchResources(text);
    }
    ,
//搜索键盘回车事件
    onBindConfirm: function (event) {
        // var text = event.detail.value;
        // this.searchResources(text);
    }
    ,
    searchResources: function (text) {
        this.data.searchResult.url = app.globalData.g_doubanBase + '/v2/movie/search?q=' + text;
        this.data.searchResult.key = "searchResult";
        this.getMovieListData(this.data.searchResult, 0);
    }
})