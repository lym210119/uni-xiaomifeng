<template>
  <view class="user-auth">
    <form @submit="formSubmit" @reset="formReset">
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
            name="name"
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
            name="phoneNum"
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
            name="captcha"
            v-model="captcha"
            @blur="verifySms"
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
          <input type="text" name="company" placeholder="请输入公司名称" />
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
      <button class="submit" form-type="submit">
        提交认证
      </button>
    </form>
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
        { title: "名片", image: [] },
        { title: "工牌", image: [] },
        { title: "公司背景墙合影", image: [] }
      ],
      captchaText: "获取验证码",
      time: 60,
      captcha: ""
    };
  },
  onLoad(opts) {
    console.log(opts);
  },
  methods: {
    validAllData(data) {
      if (!data.name.trim()) {
        uni.showToast({
          title: "请输入客户姓名！",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (!data.phoneNum.trim()) {
        uni.showToast({ title: "请输入手机号", icon: "none", duration: 2000 });
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(data.phoneNum)) {
        uni.showToast({
          title: "您输入的手机号无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return false;
      }

      if (!this.imageList.length) {
        uni.showToast({
          title: "请上传图片资料！",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      return true;
    },
    onChangePhoneNum(e) {
      this.phoneNum = e.target.value;
    },
    getCaptcha() {
      if (!this.phoneNum) {
        uni.showToast({ title: "请输入手机号", icon: "none", duration: 2000 });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.phoneNum)) {
        uni.showToast({
          title: "您输入的手机号无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (this.disabled) return;
      var params = {
        phoneNum: this.phoneNum
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
    verifySms() {
      if (!this.captcha.trim()) {
        uni.showToast({ title: "请输入验证码", icon: "none", duration: 2000 });
        return;
      }
      this.$minApi
        .verifySms({ captcha: this.captcha })
        .then(res => {
          console.log(res);
          if (res.code !== "100") {
            uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
            this.captcha = "";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    async formSubmit(e) {
      let formdata = e.detail.value;
      formdata.productId = this.productId;
      console.log(formdata);
      let valid = await this.validAllData(formdata);
      console.log(valid);
      if (valid) {
        let imgArr = await this.uploadImage();
        formdata.imgArr = imgArr;
        // this.$minApi.submitBaobei(formdata).then(res => {
        // console.log(res)
        uni.redirectTo({
          url: "result"
        });
        // }).catch(err => {
        //   alert(err)
        // })
      }
    },
    uploadImage() {
      var imgUrlArr = [];
      uni.showLoading({ title: "上传图片中..." });
      this.imageList.forEach(item => {
        uni.uploadFile({
          url: "/erp/api/upload",
          filePath: item,
          name: "file",
          // formData: {
          //     'user': 'test'
          // },
          success: function(uploadFileRes) {
            console.log(uploadFileRes);
            uni.hideLoading();
          }
        });
      });

      return imgUrlArr;
    },

    async chooseImage(i) {
      uni.chooseImage({
        count: 1,
        success: res => {
          console.log(res);
          if (res.tempFilePaths.length > 1) {
            uni.showToast({
              title: "最多选择1张图片",
              icon: "none",
              duration: 2000
            });
            return;
          }
          console.log(this.uploadList);
          this.uploadList[i].image = res.tempFilePaths;
          // const tempFilePaths = res.tempFilePaths;
          // const uploadTask = uni.uploadFile({
          //   url: "/erp/Api/upload",
          //   filePath: tempFilePaths[0],
          //   name: "file",
          //   formData: {
          //     type: "baobei"
          //   },
          //   success: uploadFileRes => {
          //     var result = JSON.parse(uploadFileRes.data);
          //     console.log(result);
          //     if (result.code != "100") {
          //       console.log(44444444444444);
          //       uni.showToast({ title: "result.msg", icon: "none" });
          //     } else {
          //       console.log(result.url);
          //       console.log("flag: " + flag);
          //       var url = this.imgBaseUrl + "/upload/xmf/house/" + result.url;
          //       if (flag === 1) {
          //         this.image1 = url;
          //         this.housePic[0] = result.url;
          //       }
          //       if (flag === 2) {
          //         this.image2 = url;
          //         this.housePic[1] = result.url;
          //       }
          //       // this.imageList.push(url)
          //       // this.housePic.push(result.url)
          //       console.log(this.imageList);
          //     }
          //   }
          // });
          // uni.showLoading({
          //   title: "上传中... "
          // });
          // uploadTask.onProgressUpdate(res => {
          //   console.log("上传进度" + res.progress);
          //   console.log("已经上传的数据长度" + res.totalBytesSent);
          //   console.log(
          //     "预期需要上传的数据总长度" + res.totalBytesExpectedToSend
          //   );

          //   // // 测试条件，取消上传任务。
          //   if (res.progress === 100) {
          //     uni.hideLoading();
          //   }
          // });
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
  padding: 10upx;
  border-radius: 10upx;
  background-color: #d99d40;
  color: #fff;
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
  line-height: 100upx;
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