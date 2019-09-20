<template>
    <view class="product-item">
      <view class="product-img">
        <image :src="item.iconFile"/>
      </view>
      <view class="product-info">
        <text class="product-name">{{item.name}}</text>
        <view class="product-desc">
          <view class="product-desc-item">
            <view class="range">{{item.quota}}万</view>
            <view>额度范围</view>
          </view>
          <view class="product-desc-item">
            <view class="range">{{item.deadline}}个月</view>
            <view>借款期限</view>
          </view>
          <view class="product-desc-item">
            <view class="range">{{item.intetrest}}%/年</view>
            <view>利息</view>
          </view>
        </view>
      </view>
      <view class="my-arrow">&gt;</view>
    </view>
</template>

<script>
	export default {
    props: {
      item: Object
    },
	}
</script>

<style>
.product-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 25upx 20upx 0;
  background-color: #fff;
  border-radius: 10upx;
  box-shadow: 0 0 10upx 0 rgba(0, 0, 0, 0.05);
  padding: 20upx 20upx;
}

.product-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 10upx;
  overflow: hidden;
}

.product-name {
  margin-left: 20upx;
  color: #333333;
  font-size: 34upx;
  font-weight: 400;
}
.product-img {
  width: 120upx;
  height: 120upx;
}
.product-img image {
  width: 100%;
  height: 100%;
}

.product-desc {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.product-desc-item {
  font-size: 24upx;
  color: #949494;
  text-align: center;
}
.range {
  font-size: 24upx;
  color: #333333;
}
.repo-title {
  width: 85%;
  margin-left: 10upx;
  color: #2d8cf0;
  font-size: 32upx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repo-desc {
  margin-left: 20upx;
  color: #7f7f7f;
  font-size: 28upx;
}

.my-arrow {
  margin: 0 10upx;
  width: 20upx;
  height: 20upx;
  line-height: 16upx;
  border: 2upx solid #949494;
  border-radius: 50%;
  font-size: 24upx;
  text-align: center;
  color: #949494;
}
</style>
