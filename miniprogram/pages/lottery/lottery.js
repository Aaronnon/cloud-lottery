// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lotteryRotate: true,
    isClick: false,
    isClick2: false,
    arr: ["一等奖:Aaron", "三等奖:Kyo", "特等奖:Vicky", "二等奖:Summer"],
    status: false,
    prizesStatus: false,
    begin: "",
    winPic: ["https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/0.png?sign=1fc0d33c06cd682919ce7d4d488731fb&t=1605238879",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/1.png?sign=81b4a877f992bcbda62c8bc83552bb78&t=1605238901",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/2.png?sign=b2a337f4b7b3606cd09ed303e31253c8&t=1605238924",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/3.png?sign=6172855e31b2ed40462ca88857318909&t=1605238957",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/4.png?sign=1b95a13bf6ac8158330999dffa2ba9ff&t=1605238968",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/5.png?sign=162836e5dc4a85929c292c587af637ad&t=1605238986"
    ],
    winPicUrl:""
  },


  onStartLottery(event) {
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    const randomUrl = Math.floor((Math.random()*this.data.winPic.length))
    // console.log(winPic.length);
    setTimeout(() => {
      this.setData({
        lotteryRotate: true,
        status: false,
        prizesStatus: true,
        begin: "",
        isClick: false,
        isClick2:false
        // winPicUrl:""
      })
    }, 6000);
    this.setData({
      isClick: false,
      isClick2:false,
      status: !this.status,
      lotteryRotate: false,
      begin: "myfirst",
      winPicUrl:this.data.winPic[randomUrl]
    })
    
    clearTimeout()
  },
  onStartLotteryAgain() {
    this.setData({
      prizesStatus: false
    })
    setTimeout(() => {
      this.onStartLottery()
    }, 1000);
  },

  onClickPrizes() {
    this.setData({
      isClick: true
    })
  },
  onClickRules() {
    this.setData({
      isClick2: true
    })
  },
  closeWinPrizes() {
    clearTimeout()
    this.setData({
      prizesStatus: false
    })
  },

  closeClickPrizes() {
    this.setData({
      isClick: false,
      isClick2:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})