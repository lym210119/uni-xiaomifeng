<template>
  <view class="page">
    <view class="item">
      <view class="item-label">
        客户姓名
      </view>
      <view class="item-input item-input-first">
        <text class="name">李阳明</text>
        <!-- <text >离保护期还有：<text class="end-date">14天</text></text> -->
        <text class="overdue">已报备过期</text>
      </view>
    </view>
    <view class="item">
      <view class="item-label">
        身份证号码
      </view>
      <view class="item-input">
        420105********361X
      </view>
    </view>
    <view class="item">
      <view class="item-label">
        客户手机号
      </view>
      <view class="item-input">
        186****6180
      </view>
    </view>
    <view class="item-textarea">
      <view class="item-label">
        基本情况说明
      </view>
      <view class="item-input uni-textarea">
        客户征信情况良好、国企工作2年以上，有公积金、 社保。 XXXXXXXXXXXX XXXXXX
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

    <view class="item-upload item-scheme">
      <view class="item-label">
        融资方案
      </view>
      <view class="item-image-list">
        <view v-if="!items.length">融资方案设计中</view>

        <view class="radio-group" v-else>
          <radio-group @change="radioChange">
            <label
              class="uni-list-cell uni-list-cell-pd"
              v-for="(item, index) in items"
              :key="item.value"
            >
              <view>
                <radio
                  :value="item.value"
                  :checked="index === current"
                  color="#d99d40"
                  style="transform:scale(0.7)"
                />
              </view>
              <view>{{ item.name }}</view>
            </label>
          </radio-group>
        </view>
      </view>
    </view>

    <!-- <button type="button" class="reload-btn" @click="toBaobei()">
      重新报备
    </button> -->
    <button type="button" class="baodan-btn" @click="toBaodan()">报单</button>
    <!-- <button type="button" class="baodan-detail-btn" @click="toBaodanDetail()">查看对应报单详情</button> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          value: "USA",
          name: "美国"
        },
        {
          value: "CHN",
          name: "中国",
          checked: "true"
        },
        {
          value: "BRA",
          name: "巴西"
        }
      ],
      current: 0,
      imageList: [
        "http://192.168.10.208:8099/upload/xmf/baobei/20191020/d77b8c1b002655142188f608b84aad97.png",
        "http://192.168.10.208:8099/upload/xmf/baobei/20191020/9d2818c170b5ce2f7ac244c95cda2512.png"
      ]
    };
  },
  methods: {
    toBaodan() {
      uni.navigateTo({
        url: "baodan"
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
  height: 80upx;
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