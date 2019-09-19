<template>
  <view class="result">
    <view v-if="result">
      <image class="result-img" src="../../static/apply-success.png"></image>
      <view class="result-text">恭喜您，申请成功啦！</view>
    </view>
    <view v-else>
      <image class="result-img" src="../../static/apply-fail.png"></image>
      <view class="result-text">申请失败！</view>
    </view>
    <view class="more" @click="toMoreProduct()">查看更多产品</view>
  </view>
</template>

<script>
export default {
  onLoad(opts) {
    console.log(opts)
    this.result = + opts.r
  },
  data() {
    return {
      result: false
    }
  },
  methods: {
    toMoreProduct() {
      uni.redirectTo({
        url: 'index'
      })
    }
  }
}
</script>

<style>
  .result {
    height: 100%;
    padding: 70upx 150upx 0;
  }
  .result-img {
    width: 438upx;
    height: 258upx
  }
  .result-text {
    line-height: 146upx;
    text-align: center;
    font-size: 32upx;
  }
  .more {
    height: 78upx;
    line-height: 78upx;
    text-align: center;
    border-radius: 50upx;
    background-color: #d99d40;
    font-size: 32upx;
    color: #ffffff;
  }
</style>