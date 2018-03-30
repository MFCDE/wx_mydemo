var app = getApp();
var util = require('../../../utils/utils.js');

Page({
    data: {
        movie: {}
    },
    onLoad: function (options) {
        //页面初始化
        var movieid = options.id;

        var url = app.globalData.g_doubanBase + "/v2/movie/subject/" + movieid;
        util.http(url, this.processDoubandData);
    },
    processDoubandData: function (data) {
        if (!data) {
            return;
        }

        console.log(data);
        var director = {
            avatar: "",
            name: "",
            id: ""
        };

        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large;
            }

            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }

        //电影详情数据
        var movie = {
            movieImg: data.images ? data.images.large : "",     //海报
            country: data.countries[0],                         //国家
            title: data.title,                                  //标题
            originalTitle: data.original_title,                 //别名
            wishCount: data.wish_count,                         //观看人数
            commentCount: data.comments_count,                  //评论人数
            year: data.year,                                    //年份
            generes: data.genres.join("、"),                     //电影类型，用、连接起来如：动作、冒险、喜剧
            stars: util.convertToStarsArray(data.rating.stars),  //星级
            score: data.rating.average,                          //评分
            director: director,                                  //导演信息
            casts: util.convertToCastString(data.casts),         //演员信息
            castsInfo: util.convertToCastInfos(data.casts),      //演员相信信息，姓名和图片
            summary: data.summary                                //简介
        }

        this.setData({movie: movie});
        console.log(this.data);
    },
    /**
     * 查看图片
     * @param event
     */
    viewMoviePostImg: function (event) {
        var src = event.currentTarget.dataset.src;

        wx.previewImage({
            urls: [src]
        })
    }
});