<template>
  <view class="page">
    <view class="item">
      <view class="item-label">
        客户姓名
      </view>
      <view class="item-input item-input-first">
        <text class="name">{{ data.cusName }}</text>
        <text v-if="!data.pastdue"
          >离保护期还有：<text class="end-date">{{ data.endDate }}</text></text
        >
        <text v-else class="overdue">已报备过期</text>
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
    <view class="item-textarea">
      <view class="item-label">
        基本情况说明
      </view>
      <view class="item-input uni-textarea">
        {{ data.explain }}
      </view>
    </view>

    <view class="item-upload">
      <view class="item-label">
        图片资料
      </view>
      <view class="item-image-list">
        <view class="uni-uploader__files">
          <block v-for="(image, index) in imageList" :key="index">
            <view class="uni-uploader__file">
              <image
                class="uni-uploader__img"
                :src="image"
                :data-src="image"
                @tap="previewImage"
              ></image>
            </view>
          </block>
        </view>
      </view>
    </view>

    <view class="item-upload item-scheme" v-if="!data.pastdue">
      <view class="item-label">
        {{data.refuseReason ? '无方案原因' : '融资方案'}}
      </view>
      <view class="item-image-list">
        <view v-if="data.refuseReason">{{data.refuseReason}}</view>
        <view v-if="data.pairingState === 1">融资方案设计中</view>
        <view class="radio-group" v-else>
          <radio-group @change="radioChange">
            <label
              class="uni-list-cell uni-list-cell-pd"
              v-for="(item, index) in items"
              :key="index"
              v-show="item.pid"
            >
              <view>
                <radio
                  :value="item.pid"
                  :checked="index === current"
                  color="#d99d40"
                  style="transform:scale(0.7)"
                />
              </view>
              <view><text class="product-name">{{ item.name }}： </text> {{ item.desc }}</view>
            </label>
          </radio-group>
        </view>
      </view>
    </view>

    <button
      v-if="data.pastdue || data.refuseReason"
      type="button"
      class="reload-btn"
      @click="toBaobei()"
    >
      重新报备
    </button>
    <button v-else
      type="button"
      class="baodan-btn"
      @click="toBaodan()"
    >
      报单
    </button>
    <!-- <button type="button" class="baodan-detail-btn" @click="toBaodanDetail()">查看对应报单详情</button> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      items: [],
      current: 0,
      imageList: [],
      originData: {}
    };
  },
  onLoad(opts) {
    if (opts.id) {
      uni.showLoading()
      this.getCusDetail(opts.id)
    }
  },
  methods: {
    getCusDetail(id) {
      this.$minApi
        .getCusDetail({ cusId: id })
        .then(res => {
          uni.hideLoading()
          if (res.code !== 1) {
            uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
            return;
          }
          this.originData = JSON.parse(JSON.stringify(res.data))
          this.data = this.setData(res.data);
          console.log(this.data)
          this.imageList = this.data.picUrl
            .split("|")
            .map(item => this.imgBaseUrl + item);
          this.items = this.data.pd;
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
          
        let timeDiff =
          new Date(data.expirationTime.replace(/\-/g, "/")).getTime() -
          new Date().getTime();
        if (timeDiff <= 0) {
          data.pastdue = "报备过期";
        }
        let endDate = parseInt(timeDiff / 1000 / 60 / 60 / 24);
        data.endDate = endDate + "天";
        if (endDate <= 0) {
          endDate = parseInt(timeDiff / 1000 / 60 / 60);
          data.endDate = endDate + "小时";
          if (endDate <= 0) {
            endDate = parseInt(timeDiff / 1000 / 60);
            data.endDate = endDate + "分钟";
          }
        }
        return data
    },
    radioChange: function(evt) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].pid === evt.target.value) {
          this.current = i;
          break;
        }
      }
    },
    toBaodan() {
      console.log(this.items)
      // var pid = this.items.length ? this.items[this.current].pid : ''
      var data = {
        pid: this.items.length ? this.items[this.current].pid : '',
        brokerId: this.originData.brokerId,
        cusId: this.originData.id,
        cusName: this.originData.cusName,
        IdNumber: this.originData.IdNumber,
        phone: this.originData.phone
      }
      uni.navigateTo({
        url: "baodan?data=" + JSON.stringify(data)
      });
    },
    toBaobei() {
      uni.navigateTo({
        url: "baobei"
      });
    },
    previewImage: function(e) {
      var current = e.target.dataset.src;
      uni.previewImage({
        current: current,
        urls: this.imageList
      });
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

.item-textarea,
.item-upload {
  padding: 0 30upx;
  border-bottom: 1upx solid #dddddd;
  font-size: 28upx;
}
.item-textarea .uni-textarea {
  margin-bottom: 30upx;
}
.item-textarea .item-label,
.item-upload .item-label {
  height: 80upx;
  line-height: 100upx;
  color: #848484;
}
.item-image-list {
  padding-bottom: 30upx;
}
.uni-uploader__files {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.uni-uploader__file {
  position: relative;
  margin: 10upx;
  width: 300upx;
  height: 200upx;
}
.uni-uploader__img {
  display: block;
  width: 300upx;
  height: 200upx;
  border: 2upx dashed #d9d9d9;
}
.uni-list-cell {
  position: relative;
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items: center;
  /* height: 80upx; */
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
.product-name {
  color: #d99d40;
}
</style>