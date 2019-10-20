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
            placeholder="请输入客户姓名"
            maxlength="11"
          />
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          客户性别
        </view>
        <view class="item-input">
          <radio-group name="gender">
            <label class="radio" style="margin-right: 30upx;">
              <radio
                value="1"
                checked="true"
                color="#d99d40"
                style="transform:scale(0.7)"
              />
              先生
            </label>
            <label class="radio">
              <radio value="2" color="#d99d40" style="transform:scale(0.7)" />
              女士
            </label>
          </radio-group>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          身份证号码
        </view>
        <view class="item-input item-idcard">
          <input
            type="text"
            name="IDCard"
            placeholder="请输入身份证号码"
            maxlength="18"
          />
          <text class="search-btn">检索资料</text>
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
          联系地址
        </view>
        <view class="item-input">
          <input
            type="text"
            name="address"
            placeholder="请输入联系地址"
            maxlength="11"
          />
        </view>
      </view>
      <view class="item">
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
      </view>
      <block v-for="(item, i) in pickerAll" :key="i">
        <view class="item">
          <view class="item-label">
            {{ item.title }}
          </view>
          <view class="item-input input-city">
            <!-- <input type="text" placeholder="请选择所在城市" /> -->
            <picker
              @change="bindPickerChange($event, i)"
              :name="item.name"
              :range="item.list"
              :value="JSON.stringify(item.list[item.current])"
              :range-key="'name'"
            >
              <view :class="{ 'uni-input': !item.current }">
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
      <view class="item">
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
      </view>
      <view class="item">
        <view class="item-label">
          进件方式
        </view>
        <label class="item-input">
          <radio-group name="intoType">
            <label class="radio" style="margin-right: 30upx;">
              <radio
                value="1"
                checked="true"
                color="#d99d40"
                style="transform:scale(0.7)"
              />
              抵押
            </label>
            <label class="radio">
              <radio value="2" color="#d99d40" style="transform:scale(0.7)" />
              信贷
            </label>
          </radio-group>
        </label>
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
          <picker
            @change="bindPickerChange"
            name="loansDateUnit"
            :range="loansDate"
            :value="JSON.stringify(loansDate[loansDateIndex])"
            :range-key="'name'"
          >
            <view class="uni-input">
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
        <label class="item-input">
          <radio-group name="tollType">
            <label class="radio" style="margin-right: 30upx;">
              <radio
                value="1"
                checked="true"
                color="#d99d40"
                style="transform:scale(0.7)"
              />
              按比例收费
            </label>
            <label class="radio">
              <radio value="2" color="#d99d40" style="transform:scale(0.7)" />
              按笔数收费
            </label>
          </radio-group>
        </label>
      </view>
      <view class="item">
        <view class="item-label">
          贷款收费
        </view>
        <view class="item-input">
          <input
            type="number"
            name="tollMoney"
            placeholder="请输入贷款收费(元)"
            maxlength="10"
          />
        </view>
      </view>
      <view class="item">
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
      </view>
      <view class="item">
        <view class="item-label">
          评估方式
        </view>
        <label class="item-input">
          <radio-group name="assessType">
            <label class="radio" style="margin-right: 30upx;">
              <radio
                value="1"
                checked="true"
                color="#d99d40"
                style="transform:scale(0.7)"
              />
              按比例
            </label>
            <label class="radio">
              <radio value="2" color="#d99d40" style="transform:scale(0.7)" />
              按笔数
            </label>
          </radio-group>
        </label>
      </view>
      <view class="item">
        <view class="item-label">
          评估收费
        </view>
        <view class="item-input">
          <input
            type="number"
            name="assessToll"
            placeholder="请输入其他收费(元)"
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
          签单备注
        </view>
        <view class="item-input uni-textarea">
          <textarea name="signRemark" placeholder="请输入内容" />
        </view>
      </view>
      <block v-for="(item, i) in uploadList" :key="item.name">
        <view class="item-upload">
          <view class="item-label">
            {{ item.title }}
            <text v-if="i === 1 || i === 2" class="item-label-small"
              >（最多2张图片）</text
            >
            <text v-if="i === 3" class="item-label-small">（最多5张图片）</text>
          </view>
          <view class="item-image-list">
            <view class="uni-uploader__files">
              <block v-for="(image, index) in item.image" :key="index">
                <view class="uni-uploader__file">
                  <image
                    class="uni-uploader__img"
                    :src="image"
                    :data-src="image"
                    @tap="previewImage"
                  ></image>
                  <!-- <input type="hidden" :name="item.name" :value="item.image[0]"> -->
                  <view class="image-clear" @click.stop="removeImage(index)">
                    <icon type="clear" size="26" />
                  </view>
                </view>
              </block>
              <view
                class="uni-uploader__input-box"
                v-show="!(item.image.length === maxCount)"
              >
                <view class="uni-uploader__input" @tap="chooseImage(i)">
                  <image
                    class="upload-image"
                    src="../../static/upload-btn.png"
                  ></image>
                  <text class="upload-text" v-if="i === 0"
                    >请上传身份证头像面</text
                  >
                  <text class="upload-text" v-else>请上传图片</text>
                </view>
              </view>
              <view class="uni-uploader__input-box" v-if="i === 0">
                <view class="uni-uploader__input" @tap="chooseImage(i)">
                  <image
                    class="upload-image"
                    src="../../static/upload-btn.png"
                  ></image>
                  <text class="upload-text">请上传身份证国徽面</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </block>
      <button class="submit" form-type="submit">
        提交报备资料
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
        { title: "所属职业", name: "job", list: [], current: null },
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
        { title: "身份证", name: "IDCard", image: [] },
        { title: "房产证", name: "houseImg", image: [] },
        { title: "行驶证", name: "carImg", image: [] },
        { title: "征信", name: "creditImg", image: [] }
      ],
      maxCount: 1
    };
  },
  onLoad(opts) {
    this.getCityList();
  },
  methods: {
    formSubmit: function(e) {
      var formdata = e.detail.value;
      console.log(formdata);
    },
    chooseImage(i) {
      if (i === 1 || i === 2) {
        this.maxCount = 2;
      } else if (i === 3) {
        this.maxCount = 5;
      }
      uni.chooseImage({
        count: this.maxCount,
        success: chooseImageRes => {
          console.log(chooseImageRes);
          const tempFilePaths = chooseImageRes.tempFilePaths;
          if (tempFilePaths.length > this.maxCount) {
            uni.showToast({
              title: "最多选择" + this.maxCount + "张图片",
              icon: "none",
              duration: 2000
            });
            return;
          }
          console.log(this.uploadList);
          this.uploadList[i].image = this.uploadList[i].image.concat(
            tempFilePaths
          );

          // uni.showLoading({ title: "上传图片中..." });
          // uni.uploadFile({
          //   url: "/erp/api/uploadHousePic",
          //   filePath: tempFilePaths[0],
          //   name: "file",
          //   formData: {
          //     type: this.uploadList[i].name
          //   },
          //   success: uploadFileRes => {
          //     console.log(uploadFileRes);
          //     if (uploadFileRes.statusCode === 200) {
          //       var data = JSON.parse(uploadFileRes.data);
          //       console.log(data);
          //       if (data.code !== "100") {
          //         uni.showToast({
          //           title: data.msg,
          //           icon: "none",
          //           duration: 2000
          //         });
          //         return;
          //       }
          //       uni.hideLoading();
          //       this.uploadList[i].image = tempFilePaths;
          //       this.formData[this.uploadList[i].name] = data.url;
          //     }
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
    bindPickerChange: function(e, i) {
      console.log(e);
      console.log("picker发送选择改变，携带值为", e.target.value);
      console.log(e.target.value);
      this.pickerAll[i].current = e.target.value;
    },
    getCityList() {
      this.$minApi
        .getCityList()
        .then(res => {
          console.log(res);
          if (res.code === "100") {
            this.pickerAll[1].list = res.res;
          }
        })
        .catch(err => {
          alert(err);
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
</style>