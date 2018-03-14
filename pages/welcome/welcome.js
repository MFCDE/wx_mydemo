Page({
    onTap:function(){
        // wx.navigateTo({
        //     url:"/pages/post/post"
        // });
        
        // wx.redirectTo({
        //     url: '/pages/post/post',
        // });
        wx.switchTab({
            url:"/pages/post/post"
        });
    }
});
