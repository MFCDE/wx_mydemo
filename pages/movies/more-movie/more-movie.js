var util = require('../../../utils/utils');
var app = getApp();

Page({
    data: {
        navigateTitle: "",    //导航栏标题
        reuqestUrl: '',      //请求地址
        totalCount: 0,      //请求总数，即当前start开始位置
        movies: {},         //绑定数据
        isEmpty: true,      //movies是否为空，是否是第一次请求数据
    },
    onLoad: function (options) {
        var that = this;
        //获取哪一种类型的标题
        var category = options.category;
        //设置当前导航栏的标题
        this.data.navigateTitle = category;

        var dataUrl = "";

        switch (category) {
            case '正在热映':
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
                break;
            case '即将上映':
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
                break;
            case 'Top250':
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/top250";
                break;
            default:
                break;
        }

        //设置当前请求url
        that.data.reuqestUrl = dataUrl;
        //第一次请求数据并绑定
        util.http(dataUrl, that.processDoubanData);
    },
    onShow: function (event) {

    },
    onReady: function (event) {
        var that = this;
        //动态改变当前导航栏的标题
        wx.setNavigationBarTitle({
            title: that.data.navigateTitle,
            success: function (res) {
                // success
            }
        })
    },
    // onScrollLower: function () {
    //     //下一次请求的URL地址和参数
    //     var nextUrl = this.data.reuqestUrl + '?start=' + this.data.totalCount + '&count=20';
    //     wx.showNavigationBarLoading();
    //     util.http(nextUrl, this.processDoubanData);
    //     console.log(nextUrl);
    // },
    //当页面滑倒最低端的时候触发，用来代替scroll-view下拉（上滑）加载更多的bindscrolltolower方法
    onReachBottom: function () {
        //下一次请求的URL地址和参数
        var nextUrl = this.data.reuqestUrl + '?start=' + this.data.totalCount + '&count=20';
        wx.showNavigationBarLoading();
        util.http(nextUrl, this.processDoubanData);
        console.log(nextUrl);
    },
    //下拉刷新触发的方法
    onPullDownRefresh: function () {
        var refreshUrl = this.data.reuqestUrl + '?start=0&count=20';
        this.data.movies = {};
        this.data.isEmpty = true;
        this.data.totalCount = 0;
        wx.showNavigationBarLoading();
        util.http(refreshUrl, this.processDoubanData);
    },
    //绑定数据方法
    processDoubanData: function (moviesDouban) {
        var that = this;
        // console.log(moviesDouban.subjects);

        //重组成需要都豆瓣电影数据，只需要图片、标题
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            //标题长度超过5用...替代
            var title = util.mubstr(subject.title, 5);
            //将星星转换成数组形式
            var stars = util.convertToStarsArray(subject.rating.stars, 5);

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

        //如果要绑定新加载的数据，那么需要同旧的数据合并在一起
        //这里注意每次都是请求20条，但要数据绑定的是上次的所有数据加上这次请求来的
        var totalMovies = {};
        //判断以前是否请求过数据
        if (!that.data.isEmpty) {
            totalMovies = that.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            that.data.isEmpty = false;
        }
        // movies = that.data.movies.concat(movies);
        that.setData(
            //这里不会覆盖不同的，相当与在data里展开
            // that.data.readyData
            {movies: totalMovies}
        );
        // console.log(totalMovies);
        //绑定数据完成隐藏加载动画
        wx.hideNavigationBarLoading();
        //绑定数据完成停止下拉刷新
        wx.stopPullDownRefresh();
        //新请求数据的开始位置=所有请求过的数量，即新请求的开始位置=上次请求的数量
        that.data.totalCount += 20;

        console.log(that.data.movies);
    },
    //点击跳转到电影详情页
    onMovieTap: function (event) {
        var movieid = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '/pages/movies/movie-detail/movie-detail?id=' + movieid
        })
    },
});

