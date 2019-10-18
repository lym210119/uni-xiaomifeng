<template>
  <view class="detail">
    <view class="detail-header">
      <view class="detail-header-title">
        <view class="detail-header-image">
          <image :src="obj.iconFile" />
        </view>
        <view class="detail-header-info">
          <text class="detail-header-name">{{ obj.name }}</text>
          <view class="detail-header-text">
            <text>{{ obj.advantage }}</text>
          </view>
        </view>
      </view>
      <view class="detail-header-desc">
        <view class="product-desc-item">
          <view class="range">{{ obj.quota }} 万</view>
          <view>额度范围</view>
        </view>
        <view class="divider"></view>
        <view class="product-desc-item">
          <view class="range">{{ obj.deadline }} 个月</view>
          <view>借款期限</view>
        </view>
        <view class="divider"></view>
        <view class="product-desc-item">
          <view class="range">{{ obj.intetrest }} %</view>
          <view>利息</view>
        </view>
      </view>
    </view>
    <view class="detail-desc">
      <view class="detail-desc-title">详细说明</view>
      <view class="desc-item-box">
        <view class="desc-item-title">年龄条件：</view>
        <view class="desc-item-text">{{ obj.ageLimit }}</view>
      </view>
      <view class="desc-item-box">
        <view class="desc-item-title">进件条件：</view>
        <view class="desc-item-text">{{ obj.intoLimit }}</view>
      </view>
      <view class="desc-item-box">
        <view class="desc-item-title">征信条件：</view>
        <view class="desc-item-text">{{ obj.creditLimit }}</view>
      </view>

      <view class="desc-item-box">
        <view class="desc-item-title">限制条件：</view>
        <view class="desc-item-text">{{ obj.limitCondition }}</view>
      </view>
      <view class="desc-item-box">
        <view class="desc-item-title">利息说明：</view>
        <view class="desc-item-text">{{ obj.intetrestExplain }}</view>
      </view>
      <view class="desc-item-box">
        <view class="desc-item-title">手续费说明：</view>
        <view class="desc-item-text">{{ obj.feeExplain }}</view>
      </view>
      <view class="desc-item-box">
        <view class="desc-item-title">额度说明：</view>
        <view class="desc-item-text">{{ obj.quotaExplain }}</view>
      </view>
      <view class="desc-item-box">
        <view class="desc-item-title">期限说明：</view>
        <view class="desc-item-text">{{ obj.deadlineExplain }}</view>
      </view>
      <view class="desc-item-box">
        <view class="desc-item-title">收入负债：</view>
        <view class="desc-item-text">{{ obj.incomeLiability }}</view>
      </view>
    </view>

    <view class="baobei-btn" @click="tobaobei(obj.id)">报备</view>
    <fabButton :is-index="false"></fabButton>
  </view>
</template>

<script>
import fabButton from "../../components/fabButton";
export default {
  components: {
    fabButton
  },
  data() {
    return {
      obj: {}
    };
  },
  onLoad(opts) {
    console.log(opts);

    this.$minApi
      .getProductDetail(opts)
      .then(res => {
        console.log(res);
        if (res.code === "100") {
          console.log(res.res);
          console.log(1);
          var data = res.res;
          data.iconFile = this.imgBaseUrl + data.iconFile;
          this.obj = data;
          console.log(this.obj);
          uni.setNavigationBarTitle({
            title: data.name
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    tobaobei(id) {
      uni.navigateTo({
        url: "baobei?id=" + id
      });
    }
  }
};
</script>

<style>
.detail {
  position: relative;
  padding-bottom: 100upx;
}
.baobei-btn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100upx;
  line-height: 100upx;
  background-color: #d99d40;
  color: #ffffff;
  font-size: 36upx;
  text-align: center;
}
.detail-header {
  padding: 0 30upx;
  background-color: #fff;
}
.detail-header-title {
  display: flex;
  flex-direction: row;
  padding: 30upx 0;
  border-bottom: 1upx solid #dddddd;
}
.detail-header-image {
  display: block;
  width: 120upx;
  height: 120upx;
  margin: 0 30upx 0 10upx;
  border-radius: 10upx;
}
.detail-header-image image {
  width: 100%;
  height: 100%;
}
.detail-header-info {
  flex: 1;
}
.detail-header-name {
  color: #333333;
  font-size: 34upx;
  font-weight: 400;
}
.divider {
  width: 1upx;
  height: 40upx;
  background-color: #dddddd;
}
.detail-header-text {
  font-size: 26upx;
  color: #949494;
}

.detail-header-desc {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 25upx 0;
}
.product-desc-item {
  font-size: 24upx;
  color: #949494;
  text-align: center;
  /* flex: 1; */
}
.range {
  font-size: 28upx;
  color: #333333;
}

.detail-desc {
  margin-top: 20upx;

  background-color: #ffffff;
}
.detail-desc-title {
  height: 100upx;
  line-height: 100upx;
  padding: 0 30upx;
  border-bottom: 1upx solid #dddddd;
  font-size: 34upx;
}
.detail-desc-title::before {
  content: "";
  display: inline-block;
  width: 10upx;
  height: 34upx;
  vertical-align: middle;
  margin-right: 20upx;
  border-radius: 10upx;
  background-color: #d99d40;
}
.desc-item-box {
  margin: 0 30upx;
  padding-bottom: 15upx;
  border-bottom: 1upx solid #dddddd;
}
.desc-item-box:last-child {
  border-bottom: none;
}
.desc-item-title {
  padding: 15upx 20upx;
  font-size: 28upx;
}
.desc-item-text {
  margin-left: 80upx;
  font-size: 28upx;
}
</style>