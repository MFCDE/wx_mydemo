var postData = require('../../../data/post-data');
var app = getApp();

Page({
    data: {
        isMusicPlaying: false
    },
    onLoad: function (options) {
        var globalData = app.globalData;

        var that = this;
        var postid = options.postid;
        //保存文章id
        that.data.postid = postid;
        var data = postData.postList[postid];

        //绑定文章数据
        that.setData(data);

        //通过缓存加载收藏状态
        var postsCollected = wx.getStorageSync('postsCollected');
        var postCollected = false;
        if (postsCollected) {
            //注意没有该postid的时候是undifine但undifine也等同于false
            postCollected = postsCollected[postid];

        } else {
            //没有缓存数据创建缓存数据
            postsCollected = {};
            postsCollected[postid] = false;
            postCollected = postsCollected[postid];
            wx.setStorageSync('postsCollected', postsCollected);
        }

        if (postCollected == undefined) {
            postCollected = false;
        }

        //绑定收藏状态
        that.setData({
            collected: postCollected
        });

        if (globalData.g_isPlayingMusic && globalData.g_currentMusicPostId === that.data.postid) {
            that.setData({
                isMusicPlaying: true
            });
        }

        that.onMusicMonitor();
    },
    onMusicMonitor: function () {
        var that = this;
        //监听音乐播放
        wx.onBackgroundAudioPlay(function () {
            //全局音乐播放ID必须等与当前页面ID
            if (app.globalData.g_currentMusicPostId == that.data.postid) {
                that.setData({
                    isMusicPlaying: true
                });
            }
            app.globalData.g_isPlayingMusic = true;
        })
        //监听音乐暂停 
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isMusicPlaying: false
            });
            app.globalData.g_isPlayingMusic = false;
        })
        //监听音乐停止
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isMusicPlaying: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        })
    },
    onCollectionTap: function (event) {
        this.getPostCollectedSyc();
        // this.getPostsCollectedAsy();
    },
    //异步缓存处理
    getPostsCollectedAsy: function () {
        var that = this;
        //点击收藏或取消收藏
        var collected = this.data.collected;
        collected = !collected;

        //获取缓存中该文章的收藏状态并修改
        var postid = this.data.postid;

        wx.getStorage({
            key: 'postsCollected',
            success: function (res) {
                // success
                var postsCollected = res.data;
                postsCollected[postid] = collected;
                that.showModal(postsCollected, collected);
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    //同步缓存处理
    getPostCollectedSyc: function () {
        //点击收藏或取消收藏
        var collected = this.data.collected;
        collected = !collected;

        //获取缓存中该文章的收藏状态并修改
        var postid = this.data.postid;
        var postsCollected = wx.getStorageSync('postsCollected');
        postsCollected[postid] = collected;
        // //更新缓存收藏状态
        // wx.setStorageSync('postsCollected', postsCollected);

        // //更新数据绑定变量，实现图片切换
        // this.setData({
        //     collected: collected
        // });

        // this.showToast(postsCollected,collected);
        this.showModal(postsCollected, collected);
    },
    showToast: function (postsCollected, collected) {
        //更新缓存收藏状态
        wx.setStorageSync('postsCollected', postsCollected);

        //更新数据绑定变量，实现图片切换
        this.setData({
            collected: collected
        });

        wx.showToast({
            title: collected ? '收藏成功' : '取消成功',
            icon: 'success',
            duration: 1500,
            // mask: true
        });
    },
    showModal: function (postsCollected, collected) {
        var that = this;
        //​模态弹窗
        wx.showModal({
            titile: '收藏',
            content: collected ? '收藏该文章?' : "取消收藏该文章?",
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '确认',
            confirmColor: '#405f80',
            success: function (res) {
                if (res.confirm) {
                    //更新缓存收藏状态
                    wx.setStorageSync('postsCollected', postsCollected);

                    //更新数据绑定变量，实现图片切换
                    that.setData({
                        collected: collected
                    });
                }
            }
        });
    },
    onShareTap: function (event) {
        // wx.removeStorageSync('key');
        wx.clearStorageSync();
    },
    onMusicTap: function () {
        var postid = this.data.postid;
        //设置全局音乐播放ID
        app.globalData.g_currentMusicPostId = this.data.postid;
        var isMusicPlaying = this.data.isMusicPlaying;
        if (isMusicPlaying) {
            wx.pauseBackgroundAudio();
            isMusicPlaying = false;
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.postList[postid].music.dataUrl,
                title: postData.postList[postid].music.title,
                coverImgUrl: postData.postList[postid].music.coverImgUrl,
            });
            isMusicPlaying = true;
        }

        //不能更改UI层的数据
        // this.data.isMusicPlaying = isMusicPlaying;

        this.setData({
            isMusicPlaying: isMusicPlaying
        });
    }
});