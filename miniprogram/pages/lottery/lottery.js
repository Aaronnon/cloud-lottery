const app = getApp()
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    sharePageImg: "",
    rewardPageImg: "",
    prizesImg: "",
    rulesImg: "",
    _spinRound: 3,
    lotteryRotate: true,
    isClick: false,
    isClick2: false,
    arr: ["一等奖:Aaron", "三等奖:Kyo", "特等奖:Vicky", "二等奖:Summer"],
    status: false,
    prizesStatus: false,
    begin: "linear",
    userPrizes: {},
    hasUserInfo: false,
    userInfo: {},
    spinFnc: "onStartLottery",
    disabled: true,
    rewardStatus: false,
    noMore: false,
    winPrize: [{
        title: "特等奖",
        url: "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/iphone.png?sign=e02ab1b041335ccd50fff597d652e30b&t=1605673947",
        winTime: Date()
      },
      {
        title: "一等奖",
        url: "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/skg.png?sign=69cb7869d259bd7c25255a94a71164ef&t=1605675438",
        winTime: Date()

      },
      {
        title: "二等奖",
        url: "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/second.png?sign=807029dcc3ece8c3fa966fca4231a343&t=1605675460",
        winTime: Date()

      },
      {
        title: "三等奖",
        url: "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/third.png?sign=081a83de6ef5b1a3d0047d52d88f51b7&t=1605675471",
        winTime: Date()

      },
      {
        title: "安慰奖",
        url: "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/nowinitem.png?sign=68dcf8f37880e62d4c566aa02871e6a1&t=1605675489",
        winTime: Date()
      },
      {
        title: "没奖励",
        url: ""
      }
    ],
    winPrizeUrl: "",
    winPic: ["https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/0.png?sign=1fc0d33c06cd682919ce7d4d488731fb&t=1605238879",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/1.png?sign=81b4a877f992bcbda62c8bc83552bb78&t=1605238901",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/2.png?sign=b2a337f4b7b3606cd09ed303e31253c8&t=1605238924",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/3.png?sign=6172855e31b2ed40462ca88857318909&t=1605238957",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/4.png?sign=1b95a13bf6ac8158330999dffa2ba9ff&t=1605238968",
      "https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/5.png?sign=162836e5dc4a85929c292c587af637ad&t=1605238986"
    ],
    winPicUrl: "",
    winPrizeTrue: [],
    prizesWeight: [1, 2, 3, 4, 1000, 98990]
  },


  onStartLottery() {


    this.lotteryWin()
    const _ = db.command

    if (this.data._spinRound > 0) {
      const randomUrl = this.lotteryWin()
      const newSpin = this.data._spinRound - 1
      const newPrizeUrl = this.data.winPrize[randomUrl]

      setTimeout(() => {
        this.setData({
          // lotteryRotate: true,
          disabled: false,
          prizesStatus: true,
          begin: "",
          spinFnc: 'onStartLottery',
          isClick: false,
          isClick2: false,
          rewardStatus: false,
          // winPrizeUrl: this.data.winPrize[randomUrl]
        })
        if (randomUrl != 5) {
          db.collection('users').doc(app.userInfo._id).update({
            data: {
              prizes: _.push(newPrizeUrl)
            }
          })
          this.winPrizeTrue()
        }
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            _spinRound: newSpin,

          }
        }).then((res) => {
          this.setData({
            _spinRound: newSpin
          })
        })
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        })



      }, 6000);
      wx.hideShareMenu({
        menus: ['shareAppMessage', 'shareTimeline']
      })

      this.setData({
        _spinRound: newSpin,
        spinFnc: '',
        disabled: true,
        // lotteryRotate: false,
        begin: "myfirst",
        winPicUrl: this.data.winPic[randomUrl],
      })

      clearTimeout()

    } else {
      const path = wx.getStorageSync('share_img')
      if (path != null) {
        this.setData({
          sharePageImg: path,
          noMore: true
        })
      }
    }

  },
  lotteryWin() {

    var weightSum = this.data.prizesWeight.reduce(function (prev, currVal) {
      return prev + currVal
    }, 0)
    var ramdon = Math.random() * weightSum;
    var concatWeightArr = this.data.prizesWeight.concat(ramdon);
    var sortedWeightArr = concatWeightArr.sort(function (a, b) {
      return a - b;
    });

    // console.log("本程序的奖项权重和值：", weightSum);
    // console.log("本次抽奖的权重随机数：", ramdon);
    // console.log("含权重随机数的新权重数组升序排序后：", sortedWeightArr);

    var randomIndex = sortedWeightArr.indexOf(ramdon);
    randomIndex = Math.min(randomIndex, this.data.winPic.length - 1); //权重随机数的下标不得超过奖项数组的长度-1，重新计算随机数在奖项数组中的索引位置                
    // console.log("本次权重随机数对应的数组下标：", randomIndex);
    return randomIndex

  },

  winPrizeTrue() {
    var that = this
    var obj = {};
    // obj.title = "win";
    obj = this.data.winPrizeUrl
    let winPrizeTrue = that.data.winPrizeTrue;
    winPrizeTrue.push(obj)
    that.setData({
      winPrizeTrue
    })
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
    /// 重新启动小程序，去缓存中获取图片的缓存地址。 然后给Imagesrc赋值
    const path = wx.getStorageSync('prize_preview')
    if (path != null) {
      this.setData({
        prizesImg: path
      })
    }
    this.setData({
      isClick: true
    })
  },
  onClickRules() {
    const path = wx.getStorageSync('rules_preview')
    if (path != null) {
      this.setData({
        rulesImg: path
      })
    }
    this.setData({
      isClick2: true
    })
  },
  onClickweChat() {
    const path = wx.getStorageSync('wechat_img')
    if (path != null) {
      wx.previewImage({
        current: path,
        urls: [path]
      })
    }

  },
  onClickRewards() {
    const path = wx.getStorageSync('myreward_preview')
    if (path != null) {
      this.setData({
        rewardPageImg: path
      })
    }
    this.setData({
      rewardStatus: true
    })
  },
  closeWinPrizes() {
    clearTimeout()
    this.setData({
      prizesStatus: false
    })
  },
  closeReward() {
    this.setData({
      rewardStatus: false
    })
  },

  closeClickPrizes() {
    this.setData({
      isClick: false,
      isClick2: false
    })
  },
  closeShare() {
    this.setData({
      noMore: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {



    this.setData({
      show: true
    })

    wx.downloadFile({
      url: 'https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/rules.png?sign=ef99c691d72ce46cea6e57efd05e6e72&t=1605240428',
      success: function (res) {
        if (res.statusCode === 200) {
          const fs = wx.getFileSystemManager()
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              wx.setStorageSync('rules_preview', res.savedFilePath)
            }
          })
        }
      }
    })

    wx.downloadFile({
      url: 'https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes/prizespage.png?sign=244ca034f1157873a9a47e2ce513a706&t=1605738403',
      success: function (res) {
        if (res.statusCode === 200) {
          const fs = wx.getFileSystemManager()
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              wx.setStorageSync('myreward_preview', res.savedFilePath)
            }
          })
        }
      }
    })

    wx.downloadFile({
      url: 'https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/prizes.png?sign=62ed288a7fdeb30c44cf13e7b1330279&t=1605239562',
      success: function (res) {
        if (res.statusCode === 200) {
          const fs = wx.getFileSystemManager()
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              wx.setStorageSync('prize_preview', res.savedFilePath)
            }
          })
        }
      }
    })

    wx.downloadFile({
      url: 'https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/wechat.jpg?sign=eb63994c982b5fae01565a9518e8656d&t=1605846181',
      success: function (res) {
        if (res.statusCode === 200) {
          const fs = wx.getFileSystemManager()
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              wx.setStorageSync('wechat_img', res.savedFilePath)
            }
          })
        }
      }
    })

    wx.downloadFile({
      url: 'https://6164-adad-8gh48azv3b404c25-1301511894.tcb.qcloud.la/share.png?sign=54dd6b44be94c4047612f452d125e987&t=1605671364',
      success: function (res) {
        if (res.statusCode === 200) {
          const fs = wx.getFileSystemManager()
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              wx.setStorageSync('share_img', res.savedFilePath)
            }
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => {

      db.collection('users').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0])
          setTimeout(() => {
            this.setData({
              _spinRound: app.userInfo._spinRound,
              winPrizeTrue: app.userInfo.prizes,
              status: true,
              show: false
            })
          }, 2000)
        } else {
          this.setData({
            disabled: false,
            show: false
          })

        }
      })
    })
  },


  onUnload: function () {
    wx.clearStorageSync()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const newShare = this.data._spinRound + 1
    if(this.data.disabled){

    }else{


    }
          

    this.setData({
      _spinRound: newShare,
      noMore: false
    })

    db.collection('users').doc(app.userInfo._id).update({
      data: {
        _spinRound: newShare
      }
    })

  },
  getUserInfo(e) {
    let userInfo = e.detail.userInfo
    if (!this.data.status && userInfo) {
      db.collection('users').add({
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          prizes: [],
          joinTime: new Date(),
          _spinRound: Number
        }
      }).then((res) => {

        db.collection('users').doc(res._id).get().then((res) => {
          app.userInfo = Object.assign(app.userInfo, res.data)

          this.setData({
            status: true,
          })

        }).then((this.onStartLottery()))
      })
    }
  }
})