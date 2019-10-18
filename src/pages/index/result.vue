<template>
  <view>
    <view class="result">
      <image class="result-img" src="../../static/apply-success.png"></image>
      <view class="result-text">客户报备成功！</view>
      <view class="userinfo">
        <view class="name"> 姓名：<text>{{data.name}}</text> </view>
        <view class="idcard">
          身份证号码：<text>{{data.IDCard}}</text>
        </view>
        <view class="datetime"> 保护期至：<text>{{data.expirationTime}}</text> </view>
      </view>
    </view>
    <view class="more">
      <text class="moreBtn baobei" @click="toBaobei()">继续报备其他客户</text>
      <text class="moreBtn mybaobei" @click="toBaobeiList()">查看我报备的客户</text>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(opts) {
    if (opts.params) {
      var data = JSON.parse(opts.params)
      this.data = data
    }
  },
  data() {
    return {
      data: {}
    };
  },
  methods: {
    toBaobei() {
      uni.redirectTo({
        url: "baobei"
      });
    },
    toBaobeiList() {
      uni.redirectTo({
        url: "myBaobeiList"
      });
    }
  }
};
</script>

<style>
.result {
  height: 100%;
  padding: 70upx 150upx 0;
}
.result-img {
  width: 438upx;
  height: 258upx;
}
.result-text {
  margin-top: 30upx;
  text-align: center;
  font-size: 36upx;
}
.userinfo {
  font-size: 28upx;
  color: #949494;
}
.userinfo view {
  line-height: 68upx;
}
.userinfo view text {
  color: #000000;
}
.more {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 50upx;
}
.moreBtn {
  padding: 20upx 30upx;
  text-align: center;
  border-radius: 50upx;
  box-shadow: 2upx 2upx 10upx 0 rgba(0, 0, 0, 0.3);
  background-color: #d99d40;
  font-size: 32upx;
  color: #ffffff;
}
.mybaobei {
  background-color: #ffffff;
  color: #333;
}
</style>