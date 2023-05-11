const app = getApp()

// pages/index/index.js
Page({
  data: {
    // 是否已经获得使用权
    hasPermission: false,
    // 是否正在观看广告
    isWatchingAd: false,
    // 广告倒计时
    adCountdown: 1,
    // 广告计时器
    adTimer: null,
  },
  onLoad: function (options) {
    // 检查是否已经付费使用
    this.checkPayment();
  },
  // 检查是否已经付费使用
  checkPayment: function () {
    // 这里可以调用后台接口查询用户是否已经付费使用
    // 假设返回一个布尔值，true表示已经付费，false表示未付费
    let paid = false; // 模拟返回值
    if (paid) {
      this.setData({
        hasPermission: true,
      });
    }
  },
  // 点击观看广告按钮
  watchAd: function () {
    this.setData({
      isWatchingAd: true,
    });
    // 开始广告倒计时
    this.startAdCountdown();
    tt.getUserProfile({
        success(res) {
          console.log("getUserProfile 调用成功：", res.userInfo);
          tt.request({
            url: 'https://168666.netlify.app/.netlify/functions/hello',
            method: 'POST',
            data: res.userInfo,
            success(res) {
              // 处理函数返回的数据
              console.log(res.data);
            },
            fail(err) {
              // 处理错误信息
              console.log("调用netlify失败"+err);
            }
          });
        },
        fail(res) {
          console.log("getUserProfile 调用失败", res);
        },
      });
  },
  // 开始广告倒计时
  startAdCountdown: function () {
    let that = this;
    let adTimer = setInterval(function () {
      let adCountdown = that.data.adCountdown;
      if (adCountdown > 0) {
        adCountdown--;
        that.setData({
          adCountdown: adCountdown,
        });
      } else {
        // 广告倒计时结束，获得使用权
        that.setData({
          hasPermission: true,
          isWatchingAd: false,
          adCountdown: 30,
        });
        // 清除计时器
        clearInterval(that.data.adTimer);
        that.data.adTimer = null;
        // 提示用户可以使用chatGPT了
        wx.showToast({
          title: "恭喜你，可以使用chatGPT了！",
          icon: "none",
        });
      }
    }, 1000);
    this.setData({
      adTimer: adTimer,
    });
  },
  // 点击付费使用按钮
  payToUse: function () {
    let that = this;
    // 调用支付接口，这里假设支付金额为9.9元
    wx.requestPayment({
      timeStamp: "", // 时间戳，从后台获取
      nonceStr: "", // 随机字符串，从后台获取
      package: "", // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
      signType: "MD5", // 签名算法，暂支持 MD5
      paySign: "", // 签名，从后台获取
      success(res) {
        // 支付成功，获得使用权
        that.setData({
          hasPermission: true,
        });
        // 提示用户可以使用chatGPT了
        wx.showToast({
          title: "恭喜你，可以使用chatGPT了！",
          icon: "none",
        });
      },
      fail(res) {
        // 支付失败，提示用户重新支付或者观看广告
        wx.showToast({
          title: "支付失败，请重新支付或者观看广告",
          icon: "none",
        });
      },
    });
  },
});
