<template>
  <view>
    <view class="result">
      <image class="result-img" src="../../static/apply-success.png"></image>
      <view class="result-text">认证信息提交成功！</view>
    </view>
    <view class="ad-box">
      <view class="qrcode">
        <image class="qrcode-img" src="../../static/qrcode_for_jinmaoshu.jpg"></image>
        <view class="qrcode-text">扫码关注公众号</view>
      </view>
      <view class="company">
        <view class="first-text">为用户提供一站式智能科技金融服务</view>
        <view>{{company.name}}提供服务支持</view>
        <view>商务合作：{{company.tel}}</view>
      </view>
    </view>
    <fabButton></fabButton>
  </view>
</template>

<script>
import fabButton from '../../components/fabButton'
import {mapState} from 'vuex'
export default {
  components: {
    fabButton
  },
  computed: ['company']
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
  margin-top: 60upx;
  text-align: center;
  font-size: 36upx;
}
.ad-box {
  position: relative;
  height: 470upx;
  margin: 100upx 60upx 30upx 60upx;
  border-top: 1px solid #e4b22f;
  border-bottom: 1px solid #e4b22f;
  font-size: 28upx;
  color: #949494;
}
.ad-box::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -24upx;
  transform: translateX(-50%);
  border-left: 12upx solid transparent;
  border-top: 12upx solid transparent;
  border-right: 12upx solid transparent;
  border-bottom: 12upx solid #e4b22f;
}
.ad-box::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -24upx;
  transform: translateX(-50%);
  border-left: 12upx solid transparent;
  border-bottom: 12upx solid transparent;
  border-right: 12upx solid transparent;
  border-top: 12upx solid #e4b22f;
}
.qrcode {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 48upx;
}
.qrcode-img {
  width: 168upx;
  height: 168upx;
  border: 16upx solid #e4b22f;
}
.qrcode-text {
  line-height: 34upx;
  font-size: 22upx;
  color: #949494;
}
.company {
  text-align: center;
  color: #949494;
}
.company view {
  line-height: 40upx;
  font-size: 24upx;
}
.company .first-text {
  height: 80upx;
  line-height: 80upx;
  font-size: 28upx;
  color: #333;
}

</style>