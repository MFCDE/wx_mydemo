var util = require('../../../utils/utils');
var app = getApp();

Page({
    data: {
        navigateTitle: "",
        // movies: {}
    },
    onLoad: function (options) {
        var that = this;
        var category = options.category;
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
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/top250?";
                break;
            default:
                break;
        }

        util.http(dataUrl, that.processDoubanData);
    },
    onShow: function (event) {

    },
    onReady: function (event) {
        var that = this;
        wx.setNavigationBarTitle({
            title: that.data.navigateTitle,
            success: function (res) {
                // success
            }
        })
    },
    onScrollLower: function () {
        console.log(123);
    },
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

        that.setData(
            //这里不会覆盖不同的，相当与在data里展开
            // that.data.readyData
            {movies: movies}
        );

        console.log(that.data.movies);

    }
});

