<template>
  <view class="baobei">
    <form @submit="formSubmit" @reset="formReset">
      <view class="item">
        <view class="item-label">
          客户姓名
        </view>
        <view class="item-input">
          <input
            type="text"
            name="name"
            v-model="propsData.cusName"
            placeholder="请输入客户姓名"
            maxlength="11"
          />
        </view>
      </view>
      <!-- <view class="item">
        <view class="item-label">
          客户性别
        </view>
        <view class="item-input">
          <radio-group name="gender">
            <label class="radio" style="margin-right: 30upx;">
              <radio value="1" color="#d99d40" style="transform:scale(0.7)" />
              先生
            </label>
            <label class="radio">
              <radio value="2" color="#d99d40" style="transform:scale(0.7)" />
              女士
            </label>
          </radio-group>
        </view>
      </view> -->
      <view class="item">
        <view class="item-label">
          身份证号码
        </view>
        <view class="item-input item-idcard">
          <input
            type="text"
            name="IDCard"
            v-model="propsData.IdNumber"
            placeholder="请输入身份证号码"
            maxlength="18"
          />
          <!-- <text class="search-btn">检索资料</text> -->
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
            v-model="propsData.phone"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          联系地址
        </view>
        <view class="item-input">
          <input type="text" name="address" placeholder="请输入联系地址" />
        </view>
      </view>
      <!-- <view class="item">
        <view class="item-label">
          客户年龄
        </view>
        <view class="item-input">
          <input
            type="number"
            name="age"
            placeholder="请输入客户年龄"
            maxlength="2"
          />
        </view>
      </view> -->
      <block v-for="(item, i) in pickerAll" :key="i">
        <view class="item">
          <view class="item-label">
            {{ item.title }}
          </view>
          <view class="item-input input-city">
            <!-- picker 隐藏域 -->
            <input
              v-show="false"
              type="text"
              :name="item.name"
              :value="JSON.stringify(item.list[item.current])"
            />
            <picker
              class="picker"
              @change="bindPickerChange($event, i)"
              :range="item.list"
              :value="item.current"
              :range-key="'name'"
            >
              <view :class="{ 'uni-input': item.current === null }">
                {{
                  item.current === null
                    ? "请选择" + item.title
                    : item.list[item.current].name
                }}</view
              >
            </picker>
            <view class="arrow"></view>
          </view>
        </view>
      </block>
      <view class="item">
        <view class="item-label">
          贷款金额
        </view>
        <view class="item-input">
          <input
            type="number"
            name="loansMoney"
            placeholder="请输入贷款金额，单位(元)"
            maxlength="10"
          />
        </view>
      </view>
      <!-- <view class="item">
        <view class="item-label">
          核定金额
        </view>
        <view class="item-input">
          <input
            type="number"
            name="checkMoney"
            placeholder="请输入核定金额，单位(元)"
            maxlength="10"
          />
        </view>
      </view> -->
      <view class="item">
        <view class="item-label">
          进件方式
        </view>
        <view class="item-input">
          <radio-group name="intoType">
            <label class="radio" style="margin-right: 30upx;">
              <radio value="1" color="#d99d40" style="transform:scale(0.7)" />
              抵押
            </label>
            <label class="radio">
              <radio value="2" color="#d99d40" style="transform:scale(0.7)" />
              信贷
            </label>
          </radio-group>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          贷款期限
        </view>
        <view class="item-input input-city">
          <input
            type="number"
            name="loansDate"
            placeholder="请输入期限"
            maxlength="10"
          />
          <!-- picker 隐藏域 -->
          <input
            v-show="false"
            type="text"
            name="loansDateUnit"
            :value="JSON.stringify(loansDate[loansDateIndex])"
          />
          <picker
            @change="bindPickerChange"
            :range="loansDate"
            :value="loansDateIndex"
            :range-key="'name'"
          >
            <view :class="{ 'uni-input': loansDateIndex === null }">
              {{
                loansDateIndex === null
                  ? "请选择"
                  : loansDate[loansDateIndex].name
              }}</view
            >
          </picker>
          <view class="arrow"></view>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          收费方式
        </view>
        <view class="item-input">
          <radio-group name="tollType" @change="handleTollTypeChange">
            <label class="radio" style="margin-right: 30upx;">
              <radio value="1" color="#d99d40" style="transform:scale(0.7)" />
              按比例收费
            </label>
            <label class="radio">
              <radio value="2" color="#d99d40" style="transform:scale(0.7)" />
              按笔数收费
            </label>
          </radio-group>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          贷款收费
        </view>
        <view class="item-input">
          <input
            type="number"
            name="tollMoney"
            :placeholder="
              flag1 === '1' ? '请输入贷款收费(%)' : '请输入贷款收费(元)'
            "
            maxlength="10"
          />
        </view>
      </view>
      <!-- <view class="item">
        <view class="item-label">
          其他收费
        </view>
        <view class="item-input">
          <input
            type="number"
            name="tollOther"
            placeholder="请输入其他收费(元)"
            maxlength="10"
          />
        </view>
      </view> -->
      <view class="item">
        <view class="item-label">
          评估方式
        </view>
        <view class="item-input">
          <radio-group name="assessType" @change="handleAssessTypeChange">
            <label class="radio" style="margin-right: 30upx;">
              <radio value="1" color="#d99d40" style="transform:scale(0.7)" />
              按比例
            </label>
            <label class="radio">
              <radio value="2" color="#d99d40" style="transform:scale(0.7)" />
              按笔数
            </label>
          </radio-group>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          评估收费
        </view>
        <view class="item-input">
          <input
            type="number"
            name="assessToll"
            :placeholder="
              flag2 === '1' ? '请输入贷款收费(%)' : '请输入贷款收费(元)'
            "
            maxlength="10"
          />
        </view>
      </view>
      <view class="item-textarea">
        <view class="item-label">
          收费说明
        </view>
        <view class="item-input uni-textarea">
          <textarea name="chargesNotes" placeholder="请输入内容" />
        </view>
      </view>
      <view class="item-textarea">
        <view class="item-label">
          报单备注
        </view>
        <view class="item-input uni-textarea">
          <textarea name="signRemark" placeholder="请输入内容" />
        </view>
      </view>
      <block v-for="(item, i) in uploadList" :key="item.name">
        <view class="item-upload">
          <view class="item-label">
            {{ item.title }}
            <text v-if="i === 2 || i === 3" class="item-label-small"
              >（最多2张图片）</text
            >
            <text v-if="i === 4" class="item-label-small">（最多5张图片）</text>
          </view>
          <view class="item-image-list">
            <view class="uni-uploader__files">
              <block v-for="(image, index) in item.image" :key="index">
                <view class="uni-uploader__file">
                  <image
                    class="uni-uploader__img"
                    :src="image"
                    :data-src="image"
                    @tap="previewImage($event, i)"
                  ></image>
                  <!-- <input type="hidden" :name="item.name" :value="item.image[0]"> -->
                  <view class="image-clear" @click.stop="removeImage(i, index)">
                    <icon type="clear" size="26" />
                  </view>
                </view>
              </block>
              <view
                class="uni-uploader__input-box"
                v-if="!(item.image.length >= item.maxCount)"
              >
                <view class="uni-uploader__input" @tap="chooseImage(i)">
                  <image
                    class="upload-image"
                    src="../../static/upload-btn.png"
                  ></image>
                  <text class="upload-text" v-if="i === 0"
                    >请上传身份证头像面</text
                  >
                  <text class="upload-text" v-else-if="i === 1"
                    >请上传身份证国徽面</text
                  >
                  <text class="upload-text" v-else>请上传图片</text>
                </view>
              </view>
              <!-- <view class="uni-uploader__input-box" v-if="i === 0">
                <view class="uni-uploader__input" @tap="chooseImage(i)">
                  <image
                    class="upload-image"
                    src="../../static/upload-btn.png"
                  ></image>
                  <text class="upload-text">请上传身份证国徽面</text>
                </view>
              </view> -->
            </view>
          </view>
        </view>
      </block>
      <button class="submit" form-type="submit">
        提交报单
      </button>
    </form>
    <fabButton></fabButton>
  </view>
</template>

<script>
import fabButton from "../../components/fabButton";
import { mapState } from "vuex";
export default {
  components: {
    fabButton
  },
  computed: mapState(["userInfo"]),
  data() {
    return {
      pickerAll: [
        {
          title: "所属职业",
          name: "job",
          list: [
            { name: "国家干部/公务员", value: 1 },
            { name: "国企/事业单位", value: 2 },
            { name: "教师", value: 3 },
            { name: "医生", value: 4 },
            { name: "律师", value: 5 },
            { name: "外企/私企", value: 6 },
            { name: "企业法人股东", value: 7 },
            { name: "个体工商户", value: 8 },
            { name: "自由职业者", value: 9 },
            { name: "其他", value: 10 }
          ],
          current: null
        },
        { title: "所在城市", name: "city", list: [], current: null },
        { title: "贷款产品", name: "product", list: [], current: null }
      ],
      loansDate: [
        { name: "年", value: "1" },
        { name: "月", value: "2" },
        { name: "日", value: "3" }
      ],
      loansDateIndex: null,
      uploadList: [
        { title: "身份证（正面）", name: "IDCardImg1", image: [], maxCount: 1 },
        { title: "身份证（反面）", name: "IDCardImg2", image: [], maxCount: 1 },
        { title: "房产证", name: "houseImg", image: [], maxCount: 2 },
        { title: "行驶证", name: "carImg", image: [], maxCount: 2 },
        { title: "征信", name: "creditImg", image: [], maxCount: 5 }
      ],
      // pid: '',
      // cusId: '',
      // brokerId: '',
      propsData: {},
      flag1: "1",
      flag2: "1"
    };
  },
  onLoad(opts) {
    // if (opts.data) {
    this.propsData = JSON.parse(opts.data);

    // this.cusId = opts.cusId,
    // this.brokerId = opts.brokerId
    // }
    this.getCityList();
    this.getProductList();
  },
  methods: {
    async formSubmit(e) {
      var formdata = e.detail.value;
      this.uploadList.forEach(item => {
        formdata[item.name] = item.image
          .map(item => item.replace(this.imgBaseUrl, ""))
          .join("|");
      });
      console.log(formdata);
      let valid = await this.validAllData(formdata);
      if (valid) {
        console.log(123);
        formdata.pid = this.propsData.pid;
        formdata.cusId = this.propsData.cusId;
        formdata.brokerId = this.propsData.brokerId;
        console.log(formdata);
        this.$minApi
          .submitDeclaration(formdata)
          .then(res => {
            if (res.code !== 1) {
              uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
              return;
            }
            uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
            setTimeout(() => {
              uni.navigateTo({
                url: "baodanList"
              });
            }, 2000);
          })
          .catch(err => {
            uni.showModal({ title: "请求失败", content: err });
          });
      }
    },
    // 验证表单数据
    validAllData(form) {
      var errTips = {
        name: "请输入姓名",
        // gender: "请选择性别",
        IDCard: "请输入身份证号码",
        phoneNum: "请输入手机号码",
        address: "请输入联系地址",
        // age: "请输入客户年龄",
        job: "请选择所属职业",
        city: "请选择所在城市",
        product: "请选择贷款产品",
        loansMoney: "请输入贷款金额",
        // checkMoney: "请输入核定金额",
        intoType: "请选择进件方式",
        loansDate: "请输入贷款期限",
        loansDateUnit: "请选择贷款期限单位",
        tollType: "请选择收费方式",
        tollMoney: "请输入贷款收费",
        // tollOther: "请输入其他收费",
        // assessType: "请选择评估方式",
        // assessToll: "请输入评估收费",
        chargesNotes: "请输入收费说明",
        signRemark: "请输入签单备注",
        IDCardImg1: "请上传身份证头像面",
        IDCardImg2: "请上传身份证国徽面"
        // houseImg: "请上传房产证",
        // carImg: "请上传行驶证",
        // creditImg: "请上传征信"
      };
      var filterArr = [
        "assessType",
        "assessToll",
        "houseImg",
        "carImg",
        "creditImg"
      ];
      for (let key in form) {
        if (filterArr.indexOf(key) > -1) continue;
        console.log(key);
        if (!form[key]) {
          uni.showToast({ title: errTips[key], icon: "none", duration: 2000 });
          return false;
        }
      }
      if (
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
          form.IDCard
        )
      ) {
        uni.showToast({
          title: "您输入的身份证号码无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(form.phoneNum)) {
        uni.showToast({
          title: "您输入的手机号无效，请重新输入",
          icon: "none",
          duration: 2000
        });
        return false;
      }

      return true;
    },
    chooseImage(i) {
      var maxCount = this.uploadList[i].maxCount;
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
        success: chooseImageRes => {
          console.log(chooseImageRes);
          const tempFilePaths = chooseImageRes.tempFilePaths;
          if (tempFilePaths.length > maxCount) {
            uni.showToast({
              title: "最多选择" + maxCount + "张图片",
              icon: "none",
              duration: 2000
            });
            return;
          }
          console.log(this.uploadList);
          // this.uploadList[i].image = this.uploadList[i].image.concat(
          //   tempFilePaths
          // );
          this.getImageInfo(tempFilePaths[0]).then(res => {
            console.log(res)
            uni.showLoading({ title: "上传图片中..." });
            uni.uploadFile({
              url: "/erp/api/uploadHousePic",
              filePath: res,
              name: "file",
              formData: {
                type: this.uploadList[i].name
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
                  this.uploadList[i].image.push(this.imgBaseUrl + data.url);
                }
              }
            });

          })
        }
      });
    },
        // 压缩图片
    getImageInfo(src) {
      return new Promise((resolve, reject) => {
        uni.showLoading({
          title: "压缩中...",
          icon: "none"
        });
        uni.getImageInfo({
          src: src,
          success(res) {
            console.log("压缩前", res);
            // 缩放图片需要的canvas
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var img = new Image();
            img.src = src;
            // base64地址图片加载完毕后
            img.onload = function() {
              // 图片原始尺寸
              var originWidth = res.width;
              var originHeight = res.height;
              // 最大尺寸限制
              var maxWidth = 1080,
                maxHeight = 1080;
              // 目标尺寸
              var targetWidth = originWidth,
                targetHeight = originHeight;
              // 图片尺寸超过400x400的限制
              if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                  // 更宽，按照宽度限定尺寸
                  targetWidth = maxWidth;
                  targetHeight = Math.round(
                    maxWidth * (originHeight / originWidth)
                  );
                } else {
                  targetHeight = maxHeight;
                  targetWidth = Math.round(
                    maxHeight * (originWidth / originHeight)
                  );
                }
              }

              // canvas对图片进行缩放
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              // 清除画布
              context.clearRect(0, 0, targetWidth, targetHeight);
              // 图片压缩
              context.drawImage(img, 0, 0, targetWidth, targetHeight);
              // canvas转为blob并上传
              var dataUrl = canvas.toDataURL();
              console.log("压缩后", dataUrl);
              resolve(dataUrl);
              uni.hideLoading();
            };
          }
        });
      });
    },
    previewImage: function(e, i) {
      console.log(e);
      var current = e.target.dataset.src;
      uni.previewImage({
        current: current,
        urls: this.uploadList[i].image
      });
    },
    // 删除图片
    removeImage(i, index) {
      console.log("remove");
      this.uploadList[i].image.splice(index, 1);
    },
    bindPickerChange: function(e, i) {
      console.log(e);
      console.log("picker发送选择改变，携带值为", e.target.value);
      console.log(e.target.value);
      if (i || i === 0) {
        this.pickerAll[i].current = e.target.value;
      } else {
        this.loansDateIndex = e.target.value;
      }
    },
    getProductList() {
      this.$minApi
        .getAllProducts()
        .then(res => {
          console.log(res);
          if (res.code !== 1) {
            uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
            return;
          }
          this.pickerAll[2].list = res.data;
          if (this.propsData.pid) {
            this.pickerAll[2].current = this.pickerAll[2].list.findIndex(
              item => item.id == this.propsData.pid
            );
          }
        })
        .catch(err => {
          uni.showModal({ title: "请求失败", content: err });
        });
    },
    getCityList() {
      this.$minApi
        .getCityList()
        .then(res => {
          console.log(res);
          if (res.code !== "100") {
            uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
            return;
          }
          this.pickerAll[1].list = res.res;
        })
        .catch(err => {
          uni.showModal({ title: "请求失败", content: err });
        });
    },
    handleTollTypeChange(evt) {
      this.flag1 = evt.target.value;
    },
    handleAssessTypeChange(evt) {
      this.flag2 = evt.target.value;
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
.item .item-input.item-idcard {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.item .item-input.item-idcard .search-btn {
  padding: 8upx 20upx;
  background: #d99d40;
  border-radius: 30upx;
  font-size: 24upx;
  color: #ffffff;
}
.item .item-input input {
  font-size: 28upx;
}

.item .item-input.input-city {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
.uni-input {
  color: #848484;
}
.input-city .arrow {
  display: block;
  width: 18upx;
  height: 29upx;
  background: url("../../static/arrow.png") no-repeat center center;
  background-size: 18upx 29upx;
}
.input-city .picker {
  flex: 1;
}
</style>