<template>
  <view class="page">
    <view class="img-view">
      <image class="login-logo" src="../../static/login-logo.png"></image>
    </view>
    <view class="login-wrap">
      <view class="login-items">
        <view class="input-item">
          <label class="label-icon phone-icon"></label>
          <input
            type="number"
            v-model="formdata.phoneNum"
            name="phoneNum"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>
        <view class="input-item">
          <label class="label-icon validcode-icon"></label>
          <input
            type="number"
            name="captcha"
            v-model="formdata.captcha"
            placeholder="请输入验证码"
            maxlength="6"
            style="border-right: 1px solid #949494;"
          />
          <text class="valid-code-btn" @click="getCaptcha">{{
            captchaText
          }}</text>
        </view>
        <view class="input-item">
          <label class="label-icon password-icon"></label>
          <input
            type="password"
            v-model="formdata.password"
            name="password"
            placeholder="请输入密码"
            maxlength="18"
          />
        </view>
        <view class="input-item">
          <label class="label-icon password-icon"></label>
          <input
            type="password"
            name="confirmPwd"
            v-model="formdata.confirmPwd"
            placeholder="请重复输入密码"
            maxlength="18"
          />
        </view>
      </view>

      <button class="submit register-btn" @click="handleClick(type)">
        {{ type === "1" ? "注册" : "提交" }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(opts) {
    this.type = opts.type;
    console.log(opts);
    uni.setNavigationBarTitle({
      title: opts.type === "1" ? "注册" : "修改密码"
    });
  },
  data() {
    return {
      type: "",
      captchaText: "获取验证码",
      time: 60,
      disabled: false,
      formdata: {
        phoneNum: "",
        captcha: "",
        password: "",
        confirmPwd: ""
      }
    };
  },
  methods: {
    /**
     * @type
     * 1、注册账号
     * 2、忘记密码？
     */
    async handleClick(type) {
      // if (type === "1") {
      let valid = await this.validAllData();
      if (valid) {
        // let verifySms = await this.verifySms();
        // console.log(verifySms);
        console.log(123);
        // if (verifySms) {
        let apiType = type === "1" ? "brokerRegister" : "updatePassword";
        this.$minApi[apiType](this.formdata)
          .then(res => {
            console.log(res);
            if (res.code !== 1) {
              uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
              return;
            }
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
            setTimeout(() => {
              uni.navigateTo({
                url: "login"
              });
            }, 2000);
          })
          .catch(err => {
            console.log(err);
          });
        // }
      }
      // }
    },
    // 获取验证码
    getCaptcha() {
      if (!this.formdata.phoneNum) {
        uni.showToast({ title: "请输入手机号", icon: "none", duration: 2000 });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.formdata.phoneNum)) {
        uni.showToast({
          title: "您输入的手机号无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (this.disabled) return;
      var params = {
        phoneNum: this.formdata.phoneNum
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
    // 验证验证码
    async verifySms() {
      if (!this.formdata.captcha.trim()) {
        uni.showToast({ title: "请输入验证码", icon: "none", duration: 2000 });
        return;
      }
      let verifySms = false;
      let a = await this.$minApi
        .verifySms({
          phoneNum: this.formdata.phoneNum,
          captcha: this.formdata.captcha
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
    // 验证表单数据
    validAllData() {
      if (!this.formdata.phoneNum.trim()) {
        uni.showToast({ title: "请输入手机号", icon: "none", duration: 2000 });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.formdata.phoneNum.trim())) {
        uni.showToast({
          title: "您输入的手机号无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (!this.formdata.captcha.trim()) {
        uni.showToast({ title: "请输入验证码", icon: "none", duration: 2000 });
        return;
      }
      if (!this.formdata.password) {
        uni.showToast({ title: "请输入密码", icon: "none", duration: 2000 });
        return;
      }
      if (this.formdata.password.length < 6) {
        uni.showToast({
          title: "密码必须6~18位字符，只能包含英文字母、数字、下划线",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (!this.formdata.confirmPwd) {
        uni.showToast({
          title: "请输入确认密码",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (this.formdata.password !== this.formdata.confirmPwd) {
        uni.showToast({
          title: "两次密码输入不一致",
          icon: "none",
          duration: 2000
        });
        return;
      }
      return true;
    }
  }
};
</script>

<style>
.page {
  overflow: hidden;
}
.img-view {
  position: relative;
  width: 750upx;
  height: 480upx;
  background: url("../../static/login-bg.png") no-repeat center center;
  background-size: 750upx 480upx;
}
.login-logo {
  position: absolute;
  width: 208upx;
  height: 208upx;
  top: 178upx;
  left: 50%;
  transform: translateX(-50%);
}
.login-wrap {
  margin: 56upx 30upx;
  padding: 0 0 40upx;
  box-shadow: 2upx 2upx 10upx 0 rgba(0, 0, 0, 0.3);
  border-radius: 30upx;
}
.login-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* padding-top: 40upx; */
  height: 82upx;
  text-align: center;
  font-size: 36upx;
  color: #949494;
}
.login-tabs view {
  flex: 1;
}
.login-tabs view:first-child {
  border-right: 1px solid #949494;
}
.login-tabs view.active text {
  color: #df631f;
  border-bottom: 2px solid #df631f;
}
.login-items {
  display: flex;
  flex-direction: column;
  /* justify-content: center;
    align-items: center; */
}
.input-item {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 68upx;
  line-height: 68upx;
  margin: 50upx 56upx 0;
  border-bottom: 2upx solid #dddddd;
  color: #949494;
}
.input-item input {
  flex: 1;
  font-size: 28upx;
}
.label-icon {
  width: 80upx;
  height: 68upx;
}
.phone-icon {
  background: url("../../static/phone.png") no-repeat center;
  background-size: 35upx 49upx;
}
.validcode-icon {
  background: url("../../static/validcode.png") no-repeat center;
  background-size: 39upx 45upx;
}
.password-icon {
  background: url("../../static/password.png") no-repeat center;
  background-size: 38upx 45upx;
}
.valid-code-btn {
  width: 140upx;
  padding: 0 30upx;
  /* border-left: 1px solid #949494; */
  text-align: center;
  font-size: 28upx;
  color: #df631f;
}
.text-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 80upx;
  line-height: 80upx;
  margin: 0 56upx;
  font-size: 24upx;
  color: #949494;
}
.text-item text {
  text-decoration: underline;
}
.register-btn {
  line-height: 90upx;
  margin: 56upx;
  background-color: #e1a94e;
  border-radius: 50upx;
  border: none;
  text-align: center;
  font-size: 32upx;
  color: #ffffff;
}
.submit::after {
  border: none;
}
</style>