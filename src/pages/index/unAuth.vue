<template>
  <view class="user-auth">
    <view class="info">
      <view class="info-title">认证说明：</view>
      <view class="info-desc">1、认证成为经纪人可以获得业务佣金；</view>
      <view class="info-desc"
        >2、输入姓名、手机号码、公司名称，并上传名片、工牌、公司背景墙合影至少一项即可提交认证。</view
      >
    </view>

    <view class="item">
      <view class="item-label">
        姓名
      </view>
      <view class="item-input">
        <input
          type="text"
          v-model="formData.name"
          placeholder="请输入姓名"
          maxlength="11"
        />
      </view>
    </view>
    <view class="item">
      <view class="item-label">
        手机号码
      </view>
      <view class="item-input">
        <input
          type="number"
          v-model="formData.phoneNum"
          placeholder="请输入手机号码"
          maxlength="11"
        />
      </view>
    </view>
    <view class="item">
      <view class="item-label">
        验证码
      </view>
      <view class="item-input captcha">
        <input
          type="number"
          v-model="formData.captcha"
          placeholder="请输入验证码"
          maxlength="6"
        />
        <view class="captcha-btn" @click="getCaptcha">{{ captchaText }}</view>
      </view>
    </view>
    <view class="item">
      <view class="item-label">
        公司名称
      </view>
      <view class="item-input">
        <input
          type="text"
          v-model="formData.company"
          placeholder="请输入公司名称"
        />
      </view>
    </view>
    <block v-for="(item, i) in uploadList" :key="i">
      <view class="item-upload">
        <view class="item-label">
          {{ item.title }}
        </view>
        <view class="item-image-list">
          <view class="uni-uploader__files">
            <view class="uni-uploader__file" v-if="item.image[0]">
              <image
                class="uni-uploader__img"
                :src="item.image[0]"
                :data-src="item.image[0]"
                @tap="previewImage"
              ></image>
              <!-- <input type="hidden" :name="item.name" :value="item.image[0]"> -->
              <view class="image-clear" @click.stop="removeImage(i)">
                <icon type="clear" size="26" />
              </view>
            </view>
            <view class="uni-uploader__input-box" v-else>
              <view class="uni-uploader__input" @tap="chooseImage(i)">
                <image
                  class="upload-image"
                  src="../../static/upload-btn.png"
                ></image>
                <text class="upload-text">请上传图片</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </block>
    <button class="submit" @click="formSubmit()">
      提交认证
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
      uploadList: [
        { title: "名片", name: "userCards", image: [] },
        { title: "工牌", name: "userWorkCard", image: [] },
        { title: "公司背景墙合影", name: "userGroupPhoto", image: [] }
      ],
      captchaText: "获取验证码",
      time: 60,
      disabled: false,
      formData: {
        name: "",
        phoneNum: "",
        captcha: "",
        company: "",
        userCards: "",
        userWorkCard: "",
        userGroupPhoto: ""
      }
    };
  },
  onLoad(opts) {
    console.log(opts);
    if (opts.data) {
      var data = JSON.parse(opts.data);
      this.formData.name = data.name;
      this.formData.phoneNum = data.phone;
      this.formData.company = data.companyName;
      if (data.businessCardUrl) {
        this.uploadList[0].image.push(
          this.imgBaseUrl + data.businessCardUrl
        );
      }
      if (data.workCardUrl) {
        this.uploadList[1].image.push(this.imgBaseUrl + data.workCardUrl);
      }
      if (data.companyWallUrl) {
        this.uploadList[2].image.push(
          this.imgBaseUrl + data.companyWallUrl
        );
      }
    }
  },
  methods: {
    // 提交认证表单
    async formSubmit() {
      console.log("valid");
      let valid = await this.validAllData();
      console.log(valid);
      if (valid) {
        console.log("verifySms");
        let verifySms = await this.verifySms();
        console.log(verifySms);
        if (verifySms) {
          console.log(this.formData);
          this.$minApi
            .submitTrustInfo(this.formData)
            .then(res => {
              console.log(res);
              if (res.code !== 1) {
                uni.showToast({
                  title: res.msg,
                  icon: "none",
                  duration: 2000
                });
                return;
              }
              uni.redirectTo({
                url: "authSubmitSuccess"
              });
            })
            .catch(err => {
              uni.showToast({ title: err, icon: "none", duration: 2000 });
            });
        }
      }
    },
    // 验证表单数据
    validAllData() {
      if (!this.formData.name.trim()) {
        uni.showToast({
          title: "请输入姓名！",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (!this.formData.phoneNum.trim()) {
        uni.showToast({ title: "请输入手机号", icon: "none", duration: 2000 });
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(this.formData.phoneNum)) {
        uni.showToast({
          title: "您输入的手机号无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (!this.formData.captcha.trim()) {
        uni.showToast({ title: "请输入验证码", icon: "none", duration: 2000 });
        return false;
      }
      if (!this.formData.company.trim()) {
        uni.showToast({
          title: "请输入公司名称",
          icon: "none",
          duration: 2000
        });
        return false;
      }

      var hasUpload = this.uploadList.every(
        item => item.image[0] === undefined
      );
      console.log("hasUpload:" + hasUpload);
      if (hasUpload) {
        uni.showToast({
          title: "请上传任意一张图片资料",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      return true;
    },
    getCaptcha() {
      if (!this.formData.phoneNum) {
        uni.showToast({ title: "请输入手机号", icon: "none", duration: 2000 });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.formData.phoneNum)) {
        uni.showToast({
          title: "您输入的手机号无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (this.disabled) return;
      var params = {
        phoneNum: this.formData.phoneNum
      };
      this.$minApi
        .getCaptcha(params)
        .then(res => {
          console.log(res);
          if (res !== 1) {
            uni.showToast({
              title: "获取验证码失败",
              icon: "none",
              duration: 2000
            });
            return;
          }
          this.captchaText = this.time + " 秒";
          this.disabled = true;
          var timer = setInterval(() => {
            this.time--;
            this.captchaText = this.time + " 秒";
            if (this.time <= 0) {
              this.captchaText = "重新发送";
              this.time = 60;
              this.disabled = false;
              clearInterval(timer);
            }
          }, 1000);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // onChnageCaptcha(e) {
    //   this.captcha = e.target.value
    // },
    // 验证验证码
    async verifySms() {
      if (!this.formData.captcha.trim()) {
        uni.showToast({ title: "请输入验证码", icon: "none", duration: 2000 });
        return;
      }
      let verifySms = false;
      let a = await this.$minApi
        .verifySms({
          phoneNum: this.formData.phoneNum,
          captcha: this.formData.captcha
        })
        .then(res => {
          console.log(res);
          if (res.code !== "100") {
            uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
            // this.captcha = "";
          } else {
            verifySms = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
      return verifySms;
    },

    async chooseImage(i) {
      uni.chooseImage({
        count: 1,
        success: chooseImageRes => {
          console.log(chooseImageRes);
          const tempFilePaths = chooseImageRes.tempFilePaths;
          if (tempFilePaths.length > 1) {
            uni.showToast({
              title: "最多选择1张图片",
              icon: "none",
              duration: 2000
            });
            return;
          }
          console.log(this.uploadList);
          uni.showLoading({ title: "上传图片中..." });
          uni.uploadFile({
            url: "/erp/api/uploadHousePic",
            filePath: tempFilePaths[0],
            name: "file",
            formData: {
              "type": this.uploadList[i].name
            },
            success: uploadFileRes => {
              console.log(uploadFileRes);
              if (uploadFileRes.statusCode === 200) {
                var data = JSON.parse(uploadFileRes.data);
                console.log(data);
                if (data.code !== "100") {
                  uni.showToast({
                    title: data.msg,
                    icon: "none",
                    duration: 2000
                  });
                  return;
                }
                uni.hideLoading();
                this.uploadList[i].image = tempFilePaths;
                this.formData[this.uploadList[i].name] = data.url;
              }
            }
          });
        }
      });
    },
    // 删除图片
    removeImage(i) {
      console.log("remove");
      this.uploadList[i].image.splice(i, 1);
    },
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
    }
  }
};
</script>

<style>
.user-auth {
  position: relative;
  padding-bottom: 100upx;
  background-color: #ffffff;
}
.info {
  padding: 30upx;
  border-bottom: 1upx solid #dddddd;
  font-size: 28upx;
}
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
}
.item .item-input {
  flex: 2;
  font-size: 28upx;
}
.item .item-input input {
  font-size: 28upx;
}
.item .item-input.captcha {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100upx;
}
.captcha-btn {
  width: 140upx;
  padding: 10upx;
  border-radius: 10upx;
  background-color: #d99d40;
  color: #fff;
  text-align: center;
  font-size: 28upx;
  white-space: nowrap;
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
.image-clear {
  position: absolute;
  top: 0;
  right: 0;
}
</style>