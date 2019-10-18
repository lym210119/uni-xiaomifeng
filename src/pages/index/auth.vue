<template>
  <view class="user-auth">
    <view class="auth-head">
      <view class="user-info">
        <view class="user-name">
          <label>姓名</label>
          <text>{{ data.name }}</text>
        </view>
        <view class="user-phone">
          <label>手机号码</label>
          <text>{{ data.phone }}</text>
        </view>
        <view class="user-company">
          <label>公司名称</label>
          <text>{{ data.companyName }}</text>
        </view>
      </view>
      <view class="auth-status">
        <image class="auth-icon" :src="active.icon"></image>
        <view class="auth-text">{{ active.title }}</view>
      </view>
    </view>

    <block v-for="(item, i) in uploadList" :key="i">
      <view class="item-upload" v-if="item.image[0]">
        <view class="item-label">
          {{ item.title }}
        </view>
        <view class="item-image-list">
          <view class="uni-uploader__files">
            <view class="uni-uploader__file">
              <image
                class="uni-uploader__img"
                :src="item.image[0]"
                :data-src="item.image[0]"
                @tap="previewImage"
              ></image>
            </view>
            <!-- <view class="uni-uploader__input-box" v-else>
              <view class="uni-uploader__input" @tap="chooseImage(i)">
                <image
                  class="upload-image"
                  src="../../static/upload-btn.png"
                ></image>
                <text class="upload-text">请上传图片</text>
              </view>
            </view> -->
          </view>
        </view>
      </view>
    </block>
    <view class="item-upload" v-if="data.status === 4">
      <view class="item-label">
        失败原因
      </view>
      <view class="fail-text">
        {{ data.trustFailReason }}
      </view>
    </view>
    <button class="submit" @click="againAuth()" v-if="data.status !== 2">
      重新认证
    </button>
    <fabButton></fabButton>
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
      data: {},
      authStatus: [
        { status: 2, title: "认证中", icon: "../../static/auth-icon-ing.png" },
        {
          status: 3,
          title: "已认证",
          icon: "../../static/auth-icon-success.png"
        },
        {
          status: 4,
          title: "认证失败",
          icon: "../../static/auth-icon-fail.png"
        }
      ],
      active: "",
      uploadList: [
        { title: "名片", name: "userCards", image: [] },
        { title: "工牌", name: "userWorkCard", image: [] },
        { title: "公司背景墙合影", name: "userGroupPhoto", image: [] }
      ]
    };
  },
  onLoad(opts) {
    console.log(JSON.parse(opts.data));
    this.data = JSON.parse(opts.data);
    this.active = this.authStatus.find(
      item => item.status === this.data.status
    );
    if (this.data.businessCardUrl) {
      this.uploadList[0].image.push(
        this.imgBaseUrl + this.data.businessCardUrl
      );
    }
    if (this.data.workCardUrl) {
      this.uploadList[1].image.push(this.imgBaseUrl + this.data.workCardUrl);
    }
    if (this.data.companyWallUrl) {
      this.uploadList[2].image.push(this.imgBaseUrl + this.data.companyWallUrl);
    }
  },
  methods: {
    previewImage: function(e) {
      var current = e.target.dataset.src;
      var arr = this.uploadList
        .map(item => item.image.join(""))
        .filter(item => item !== "");
      console.log(arr);
      console.log(e);
      uni.previewImage({
        current: current,
        urls: arr
      });
    },
    againAuth() {
      uni.navigateTo({
        url: 'unAuth?data=' + JSON.stringify(this.data)
      })
    }
  }
};
</script>

<style>
.submit {
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
.submit::after {
  border: none;
  border-radius: 0;
}
.user-auth {
  position: relative;
  padding-bottom: 100upx;
  background-color: #ffffff;
}
.auth-head {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  /* align-items: center; */
  padding: 30upx;
  border-bottom: 1px solid #dddddd;
}
.user-info {
  min-width: 0;
  flex: 1;
  font-size: 28upx;
  color: #949494;
}
.user-info view {
  /* width: 100%; */
  line-height: 60upx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-info view label {
  margin-right: 30upx;
}
.user-info view text {
  color: #333333;
}
.auth-status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 146upx;
  height: 146upx;
  margin-left: 30upx;
  background-color: #e4b22f;
  border: 14upx solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  text-align: center;
  font-size: 32upx;
  color: #ffffff;
}
.auth-icon {
  width: 42upx;
  height: 42upx;
}
.fail-text {
  padding-bottom: 60upx;
}
.item-upload {
  padding: 0 30upx;
  border-bottom: 1upx solid #dddddd;
  font-size: 28upx;
}

.item-upload .item-label {
  height: 80upx;
  line-height: 80upx;
}

.item-image-list {
  padding-bottom: 30upx;
}
.uni-uploader__files {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.uni-uploader__input-box {
  position: relative;
  margin: 10upx 0;
  width: 300upx;
  height: 200upx;
  border: 2upx dashed #d9d9d9;
}
.uni-uploader__input {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* opacity: 0; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  text-align: center;
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
.upload-image {
  width: 90upx;
  height: 90upx;
}
.upload-text {
  margin-top: 20upx;
  font-size: 26upx;
  color: #949494;
}
</style>