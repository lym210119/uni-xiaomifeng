<template>
  <view class="baobei">
    <form @submit="formSubmit" @reset="formReset">
      <view class="info">
        <view class="info-title">报备说明：</view>
        <view class="info-desc"
          >1、填写用户的身份证、姓名、基本情况说明 及
          身份证、房产证等图片资料即可对客户进行报备；</view
        >
        <view class="info-desc"
          >2、报备成功后，平台将会为您的客户设置为期15天的客户保护期。</view
        >
      </view>

      <view class="item">
        <view class="item-label">
          客户姓名
        </view>
        <view class="item-input">
          <input
            type="text"
            name="name"
            placeholder="请输入客户姓名"
            maxlength="11"
          />
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          客户手机号
        </view>
        <view class="item-input">
          <input
            type="number"
            name="phoneNum"
            placeholder="请输入客户手机号"
            maxlength="11"
          />
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          身份证号码
        </view>
        <view class="item-input">
          <input
            type="text"
            name="IDCard"
            placeholder="请输入身份证号码"
            maxlength="18"
          />
        </view>
      </view>
      <view class="item-textarea">
        <view class="item-label">
          基本情况说明<text class="item-label-small">(小于200字)</text>
        </view>
        <view class="item-input uni-textarea">
          <textarea name="baseInfo" placeholder="请填写基本情况说明" />
        </view>
      </view>

      <view class="item-upload">
        <view class="item-label">
          图片资料<text class="item-label-small">(1-4张)</text>
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
                <view class="image-clear" @click.stop="removeImage(index)">
                  <icon type="clear" size="26" />
                </view>
              </view>
            </block>
            <view class="uni-uploader__input-box" v-if="imageList.length !== 4">
              <view class="uni-uploader__input" @tap="chooseImage">
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

      <button class="submit" form-type="submit">
        提交报备资料
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
      productId: "",
      imageList: []
    };
  },
  onLoad(opts) {
    this.productId = opts.id;
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
      if (!/^1[3456789]\d{9}$/.test(data.phoneNum)) {
        uni.showToast({
          title: "您输入的手机号无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
          data.IDCard
        )
      ) {
        uni.showToast({
          title: "您输入的身份证号码无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (!data.baseInfo.trim()) {
        uni.showToast({
          title: "请输入基本情况说明！",
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

    chooseImage: async function() {
      uni.chooseImage({
        count: 4,
        success: res => {
          console.log(res);
          if (res.tempFilePaths.length > 4) {
            uni.showToast({
              title: "最多选择4张图片",
              icon: "none",
              duration: 2000
            });
            return;
          }
          this.imageList = this.imageList.concat(res.tempFilePaths);
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
          //       uni.showToast({ title: "result.msg", icon: "none", duration: 2000 });
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
      this.imageList.splice(i, 1);
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
.baobei {
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
.item .item-input.captcha,
.item .item-input.input-city {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100upx;
}

.item-textarea,
.item-upload {
  padding: 0 30upx;
  border-bottom: 1upx solid #dddddd;
  font-size: 28upx;
}
.item-textarea .item-label,
.item-upload .item-label {
  height: 80upx;
  line-height: 100upx;
}
.item-textarea .item-label .item-label-small,
.item-upload .item-label .item-label-small {
  color: #818181;
  font-size: 24upx;
}
.item-textarea .item-input {
  width: 100%;
  height: 200upx;
}
.item-textarea .item-input textarea {
  font-size: 28upx;
}
.uni-textarea uni-textarea {
  width: 100%;
  /* padding: 0 30upx; */
  line-height: 1.6;
  /* font-size: 28upx; */
  height: 180upx;
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
  margin: 10upx;
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