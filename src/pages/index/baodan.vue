<template>
  <view class="baodan">
    <form @submit="formSubmit" @reset="formReset">
      <view class="item">
        <view class="item-label">
          所在城市
        </view>
        <view class="item-input input-city">
          <!-- <input type="text" placeholder="请选择所在城市" /> -->
          <picker
            @change="bindPickerChange"
            name="city"
            :range="cityList"
            :value="JSON.stringify(cityList[index])"
            :range-key="'name'"
          >
            <view class="uni-input">
              {{
                index === null ? "请选择所在城市" : cityList[index].name
              }}</view
            >
          </picker>
          <view class="city-icon"></view>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          经纪人姓名
        </view>
        <view class="item-input">
          <input type="text" name="name" placeholder="请输入经纪人姓名" maxlength="11"/>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          经纪人电话
        </view>
        <view class="item-input">
          <input
            type="number"
            @input="onChangePhoneNum"
            name="phoneNum"
            placeholder="请输入经纪人电话"
            maxlength="11"
          />
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          验证码
        </view>
        <view class="item-input captcha">
          <input type="number" name="captcha" v-model="captcha" @blur="verifySms" placeholder="请输入验证码" maxlength="6"/>
          <view class="captcha-btn" @click="getCaptcha">{{captchaText}}</view>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          贷款金额
        </view>
        <view class="item-input">
          <input type="digit" name="money" placeholder="请输入贷款金额" maxlength="10" />
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          贷款利率
        </view>
        <view class="item-input">
          <input type="digit" name="interest" placeholder="请输入贷款利率(%)" maxlength="10"/>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          手续费
        </view>
        <view class="item-input">
          <input type="digit" name="handCharge" placeholder="请输入手续费" maxlength="10"/>
        </view>
      </view>

      <view class="upload-item">
        <view class="upload-item-head">
          <view class="item-label">上传房产证首页</view>
          <view class="item-example">照片示例</view>
        </view>
        <view class="upload-item-box">
          <view
            class="upload-box-btn"
            @click="uploadImage(1)"
            v-if="!image1"
          >
            <image class="upload-image" src="../../static/upload.png"></image>
            <text class="upload-text">上传房产证首页</text>
          </view>
          <view class="upload-file" v-else>
            <image
              :src="image1"
              :data-src="image1"
              @click="previewImage"
            ></image>
          </view>
        </view>
      </view>
      <view class="upload-item">
        <view class="upload-item-head">
          <view class="item-label">上传房产证户型图</view>
          <view class="item-example">照片示例</view>
        </view>
        <view class="upload-item-box">
          <view
            class="upload-box-btn"
            @click="uploadImage(2)"
            v-if="!image2"
          >
            <image class="upload-image" src="../../static/upload.png"></image>
            <text class="upload-text">上传房产证户型图</text>
          </view>
          <view class="upload-file" v-else>
            <image
              :src="image2"
              :data-src="image2"
              @click="previewImage"
            ></image>
          </view>
        </view>
      </view>
      <button class="submit" form-type="submit">
        提交
      </button>
    </form>
    <view class="fab-btn">
      <view class="fab-button" @click.stop="toBack()">
        <text class="fab-text">返回</text>
      </view>
      <view class="fab-button" @click.stop="toIndex()">
        <text class="fab-text">主页</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      productId: '',
      cityList: [],
      index: null,
      phoneNum: '',
      captchaText: '获取验证码',
      time: 60,
      captcha: '',
      disabled: false,
      image1: '',
      image2: '',
      host: 'http://192.168.10.208:8088/upload/xmf/house/',
      housePic: [],
    }
  },
  onLoad(opts) {
    this.productId = opts.id
    this.getCityList()
    console.log(opts)
  },
  methods: {
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.target.value)
        console.log(e.target.value)
        this.index = e.target.value
    },
    getCityList() {
      this.$minApi.getCityList().then(res => {
        console.log(res)
        if (res.code === '100') {
          this.cityList = res.res
        }
      }).catch(err => {
        alert(err)
      })
    },
    onChangePhoneNum(e){
      this.phoneNum = e.target.value
    },
    getCaptcha() {
      if (!this.phoneNum) {
        uni.showToast({title: '请输入手机号', icon: 'none'})
        return 
      }
      if (!(/^1[3456789]\d{9}$/.test(this.phoneNum))) {
        uni.showToast({title: '您输入的手机号无效，请重新输入', icon: 'none'})
        return
      }
      if (this.disabled) return
      var params = {
        phoneNum: this.phoneNum
      }
      this.$minApi.getCaptcha(params).then(res => {
        console.log(res)
        if (res !== 1) {
          uni.showToast({title: '获取验证码失败', icon: 'none'})
          return
        }
        this.captchaText = this.time + ' 秒'
        this.disabled = true
        var timer = setInterval(() => {
          this.time--
          this.captchaText = this.time + ' 秒'
          if (this.time <= 0) {
            this.captchaText = '重新发送'
            this.time = 60
            this.disabled = false
            clearInterval(timer)
          }
        }, 1000)

      }).catch(err => {
        console.log(err)
      })
    },
    // onChnageCaptcha(e) {
    //   this.captcha = e.target.value
    // },
    verifySms() {
      if (!this.captcha.trim()) {
        uni.showToast({title: '请输入验证码', icon: 'none'})
        return
      }
      this.$minApi.verifySms({captcha: this.captcha}).then(res => {
        console.log(res)
        if (res.code !== '100') {
          uni.showToast({title: res.msg, icon: 'none'})
          this.captcha = ''
        }
      }).catch(err => {
        console.log(err)
      })
    },
    uploadImage(flag) {
      uni.chooseImage({
          count: 1, //默认9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          // sourceType: ['album'], //从相册选择
          success: (chooseImageRes) => {
            console.log(chooseImageRes)
            // this.imageList = this.imageList.concat(chooseImageRes.tempFilePaths)
            // this.$minApi.uploadHousePic({image: chooseImageRes.tempFilePaths[0], type: 'house'}).then(res => {
            //   console.log(res)
            // }).catch(err => {
            //   console.log(err)
            // })
            const tempFilePaths = chooseImageRes.tempFilePaths;
            const uploadTask = uni.uploadFile({
                url: '/Api/uploadHousePic', //仅为示例，非真实的接口地址
                filePath: tempFilePaths[0],
                name: 'file',
                formData: {
                    'type': 'house'
                },
                success: (uploadFileRes) => {
                    var result = JSON.parse(uploadFileRes.data);
                    console.log(result)
                    if (result.code != '100') {
                      console.log(44444444444444)
                      uni.showToast({title: 'result.msg', icon: 'none'})
                    } else {
                      console.log(result.url)
                      console.log('flag: ' + flag)
                      var url = this.host + result.url
                      if (flag === 1) {
                        this.image1 = url
                        this.housePic[0] = result.url
                      }
                      if (flag === 2) {
                        this.image2 = url
                        this.housePic[1] = result.url
                      }
                      // this.imageList.push(url)
                      // this.housePic.push(result.url)
                      console.log(this.imageList)
                    }
                }
            });
            uni.showLoading({
                title: '上传中... '
            });
            uploadTask.onProgressUpdate((res) => {
                console.log('上传进度' + res.progress);
                console.log('已经上传的数据长度' + res.totalBytesSent);
                console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

                // // 测试条件，取消上传任务。
                if (res.progress === 100) {
                    uni.hideLoading();
                }
            });
          }
      });
    },
    previewImage (e) {
      console.log(e)
      var current = e.target.dataset.src
      uni.previewImage({
        current: current,
        urls: [current]
      })
    },
    formSubmit: function(e) {
      var formdata = e.detail.value
      console.log(formdata)
      if (!formdata.city) {
        uni.showToast({title: '请选择所在城市', icon: 'none'})
        return
      }
      if (!formdata.name.trim()) {
        uni.showToast({title: '请输入经纪人姓名', icon: 'none'})
        return
      }
      if (!formdata.phoneNum.trim()) {
        uni.showToast({title: '请输入经纪人电话', icon: 'none'})
        return
      }
      if (!formdata.captcha.trim()) {
        uni.showToast({title: '请输入验证码', icon: 'none'})
        return
      }
      if (!formdata.money.trim()) {
        uni.showToast({title: '请输入贷款金额', icon: 'none'})
        return
      }
      if (!formdata.interest.trim()) {
        uni.showToast({title: '请输入贷款利率', icon: 'none'})
        return
      }
      if (!formdata.handCharge.trim()) {
        uni.showToast({title: '请输入手续费', icon: 'none'})
        return
      }
      if (!this.image1) {
        uni.showToast({title: '请上传房产证首页', icon: 'none'})
        return
      }
      if (!this.image2) {
        uni.showToast({title: '请上传房产证户型图', icon: 'none'})
        return
      }
      
      formdata.housePic = this.housePic.join('|')
      formdata.productId = this.productId
      // formdata = JSON.stringify(formdata)
      console.log(formdata)
      this.$minApi.submitDeclaration(formdata).then(res => {
        console.log(res)
        if (res.code !== '100') {
          uni.redirectTo({
            url: 'result?r=0'
          })
        }
        uni.redirectTo({
          url: 'result?r=1'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    formReset: function(e) {
        console.log('清空数据')
    },
    toBack() {
      uni.navigateBack();
    },
    toIndex () {
      uni.navigateTo({
          url: 'index'
      });
    }
  }
}
</script>

<style>
.baodan {
  position: relative;
  padding-bottom: 100upx;
  background-color: #ffffff;
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
}
.submit::after {
  border: none;
  border-radius: 0;
}
.fab-btn {
  position: fixed;
  right: 30upx;
  bottom: 202upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.fab-button {
  width: 90upx;
  height: 90upx;
  line-height: 90upx;
  border-radius: 50%;
  box-shadow: 2upx 2upx 10upx 0 rgba(0, 0, 0, 0.3);
  background-color: #e2ab51;
  z-index: 99;
}
.fab-button:first-child {
  margin-bottom: 20upx;
  background-color: #ffffff;
}
.fab-button:first-child .fab-text {
  color: #e2ab51;
}
.fab-text {
  display: block;
  text-align: center;
  font-size: 26upx;
  color: #ffffff;
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
.item-label {
  flex: 1;
  font-size: 30upx;
}
.item-input {
  flex: 2;
  font-size: 30upx;
}
.item-input.captcha,
.item-input.input-city {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100upx;
}
.city-icon {
  width: 31upx;
  height: 31upx;
  margin-left: 20upx;
  background: url("../../static/city.png");
  background-size: 31upx 31upx;
}
.captcha-btn {
  padding: 10upx;
  border-radius: 10upx;
  background-color: #d99d40;
  color: #fff;
  font-size: 28upx;
  white-space: nowrap;
}
.upload-item {
  padding: 0 30upx;
}
.upload-item-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100upx;
}
.item-example {
  font-size: 26upx;
  color: #949494;
}
.item-example::before {
  content: "!";
  display: inline-block;
  width: 24upx;
  height: 24upx;
  line-height: 24upx;
  margin-right: 10upx;
  vertical-align: middle;
  border: 2upx solid #d99d40;
  border-radius: 50%;
  text-align: center;
  color: #d99d40;
  font-size: 20upx;
}
.upload-item-box {
  padding-bottom: 40upx;
}
.upload-box-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 360upx;
  height: 210upx;
  margin: 0 auto;
  border: 2upx dashed #dddddd;
  text-align: center;
}
.upload-file {
  text-align: center;
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