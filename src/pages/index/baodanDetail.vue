<template>
  <view class="page">
    <view class="item">
      <view class="item-label">
        客户姓名
      </view>
      <view class="item-input item-input-first">
        <text class="name">{{ data.cusName }}</text>
      </view>
    </view>
    <view class="item">
      <view class="item-label">
        客户性别
      </view>
      <view class="item-input item-input-first">
        <text class="name">{{ data.cusName }}</text>
      </view>
    </view>
    <view class="item">
      <view class="item-label">
        身份证号码
      </view>
      <view class="item-input">
        {{ data.IdNumber }}
      </view>
    </view>
    <view class="item">
      <view class="item-label">
        客户手机号
      </view>
      <view class="item-input">
        {{ data.phone }}
      </view>
    </view>

    <view class="item item-btn">
      <view class="item-show-btn" @click="toggleInfoData()"
        >显示/隐藏做单详细资料</view
      >
    </view>

    <view class="infodata" v-if="toggle">
      <view class="infodata-title">
        跟单详情
      </view>
      <view class="infodata-list">
        <view class="infodata-item" v-for="(item, i) in detailInfo" :key="i">
          <view class="one">
            <view class="text-item"
              >进度名称：<text>{{ item.LVAL1 }}</text></view
            >
            <view class="text-item"
              >具体流程：<text>{{ item.LVAL2 }}</text></view
            >
          </view>
          <view class="two">
            跟进日期：<text class="two-time">{{ item.FTIME }}</text>
          </view>
          <view class="three">
            跟进内容：<text>{{ item.VAL }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- <button type="button" class="baodan-detail-btn" @click="toBaodanDetail()">查看对应报单详情</button> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      detailInfo: [],
      toggle: false
    };
  },
  onLoad(opts) {
    if (opts.id) {
      uni.showLoading();
      this.getCusDetail(opts.id);
    }
  },
  methods: {
    toggleInfoData() {
      if (this.data.status === 3) {
        uni.showToast({
          title: "审核中, 暂无做单详情",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (!this.toggle) {
        uni.showLoading();
        this.$minApi
          .getInfoData({ sid: this.data.sid })
          .then(res => {
            uni.hideLoading();
            if (res.code !== 1) {
              uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
              return;
            }
            if (!res.data.length) {
              uni.showToast({
                title: "暂无做单跟进记录",
                icon: "none",
                duration: 2000
              });
              return;
            }
            this.detailInfo = res.data;
            this.toggle = !this.toggle;
          })
          .catch(err => {
            uni.showModal({ title: "请求失败", content: err });
          });
      } else {
        this.toggle = !this.toggle;
      }
    },
    getCusDetail(id) {
      this.$minApi
        .getCusDetail({ cusId: id })
        .then(res => {
          uni.hideLoading();
          if (res.code !== 1) {
            uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
            return;
          }
          this.data = this.setData(res.data);
          console.log(this.data);
        })
        .catch(err => {
          uni.showModal({ title: "请求失败", content: err });
        });
    },
    setData(data) {
      data.IdNumber =
        data.IdNumber.substr(0, 6) +
        new Array(data.IdNumber.length - 9).join("*") +
        data.IdNumber.substr(-4);

      data.phone =
        data.phone.substr(0, 3) +
        new Array(data.phone.length - 6).join("*") +
        data.phone.substr(-4);

      return data;
    }
  }
};
</script>

<style>
.item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 30upx;
  height: 100upx;
  border-bottom: 1upx solid #dddddd;
}
.item .item-label {
  flex: 1;
  font-size: 28upx;
  color: #848484;
}
.item .item-input {
  flex: 2;
  font-size: 28upx;
}
.item-input-first {
  display: flex;
  justify-content: space-between;
  color: #848484;
}
.item-upload.item-scheme {
  padding-bottom: 100upx;
}
.item-input-first .name,
.item-input-first .overdue,
.item-input-first .end-date {
  color: #333;
}

.item.item-btn {
  height: auto;
}
.item-show-btn {
  flex: 1;
  margin: 40upx 30upx;
  height: 80upx;
  line-height: 80upx;
  text-align: center;
  border-radius: 60upx;
  background-color: #d99d40;
  font-size: 32upx;
  color: #ffffff;
}
.infodata-title {
  height: 100upx;
  line-height: 100upx;
  padding: 0 30upx;
  border-bottom: 1upx solid #dddddd;
  font-size: 28upx;
}
.infodata-title::before {
  content: "";
  display: inline-block;
  width: 6upx;
  height: 24upx;
  vertical-align: middle;
  margin-right: 20upx;
  border-radius: 30upx;
  background-color: #d99d40;
}

.infodata-item {
  display: flex;
  flex-direction: column;
  padding: 20upx 30upx;
  border-bottom: 1upx solid #dddddd;
}
.infodata-item .one {
  display: flex;
  flex-direction: row;
  height: 60upx;
}
.infodata-item .one .text-item {
  flex: 1;
  font-size: 28upx;
  color: #848484;
}
.infodata-item .one .text-item text {
  color: #333;
}
.infodata-item .two {
  height: 60upx;
  font-size: 28upx;
  color: #848484;
}
.infodata-item .three {
  font-size: 28upx;
  color: #848484;
}
.infodata-item .two text,
.infodata-item .three text {
  color: #333;
}

.baodan-btn,
.reload-btn,
.baodan-detail-btn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100upx;
  line-height: 100upx;
  border: none;
  border-radius: 0;
  background-color: #d99d40;
  text-align: center;
  font-size: 36upx;
  color: #ffffff;
  z-index: 100;
}
.baodan-btn::after,
.reload-btn::after,
.baodan-detail-btn::after {
  border: none;
  border-radius: 0;
}
</style>