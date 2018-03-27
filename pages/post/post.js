var postsData = require('../../data/post-data');

Page({
    data: {},
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        // var posts_content = [
        //         {
        //             date: "Nov 25 2016",
        //             title: "正是虾肥蟹壮时",
        //             img: {
        //                 author_img: "/images/avatar/1.png",
        //                 post_img: "/images/post/crab.png",
        //             },
        //             img_condition: true,
        //             content: "秋天是吃螃蟹的季节，“金秋菊黄蟹正肥”中秋的螃蟹是最好吃的。农历八月，天气渐凉，桂花飘香，金菊竞放，游荡在河汊湖荡里的螃蟹也到了一年中最为肥美的时节。“看你横行到几时?”看看这诗句就知道,真的到了吃螃蟹的时候了。",
        //             reading: "112",
        //             collection: "96",
        //             fal: false
        //         },
        //         {
        //             date: "Nov 25 2016",
        //             title: "正是虾肥蟹壮时",
        //             img: {
        //                 author_img: "/images/avatar/1.png",
        //                 post_img: "/images/post/crab.png",
        //             },
        //             img_condition: true,
        //             content: "秋天是吃螃蟹的季节，“金秋菊黄蟹正肥”中秋的螃蟹是最好吃的。农历八月，天气渐凉，桂花飘香，金菊竞放，游荡在河汊湖荡里的螃蟹也到了一年中最为肥美的时节。“看你横行到几时?”看看这诗句就知道,真的到了吃螃蟹的时候了。",
        //             reading: "112",
        //             collection: "96",
        //             fal: false
        //         }
        //     ];

        this.setData({
            post_key: postsData.postList
        });
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
    onPostTap: function (event) {
        var postid = event.currentTarget.dataset.postid;

        wx.navigateTo({
            //相对路径
            url: 'post-detail/post-detail?postid=' + postid
        });
    },
    // onSwiperItemTap:function (event) {  
    //     var postid = event.currentTarget.dataset.postid;

    //     wx.navigateTo({
    //         //绝对路径
    //         url:'/pages/post/post-detail/post-detail?postid=' + postid
    //     });
    // }
    onSwiperTap: function (event) {
        //错误写法，应该用target不能用currentTarget，这里指的是当前点击的组件,currentTarget是事件捕获的组件
        //target指的是image组件，而currentTarget指的是swiper组件
        // var postid = event.currentTarget.dataset.postid;
        var postid = event.target.dataset.postid;

        wx.navigateTo({
            //绝对路径
            url: '/pages/post/post-detail/post-detail?postid=' + postid
        });
    },
    onReTap: function () {
        wx.switchTab({
            url: "/pages/movies/movies",
        });
    }
})