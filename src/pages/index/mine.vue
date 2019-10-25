<template>
  <view class="page">
    <view class="img-view">
      <view class="user-avatar">
        <image class="" src="../../static/logo.png"></image>
      </view>
      <view class="user-info">
        <view class="username">{{ data.name || "未认证" }}</view>
        <view class="user-phone">{{ phoneNum }}</view>
      </view>
    </view>
    <view class="list">
      <view
        class="list-item"
        v-for="(item, i) in list"
        :key="i"
        @click="handleLsitClick(item)"
      >
        <image class="list-icon" :src="item.icon"></image>
        <text class="list-text">{{ item.title }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: mapState(["hasLogin", "userInfo"]),
  data() {
    return {
      data: {},
      phoneNum: "",
      list: [
        {
          title: "经纪人认证",
          url: "unAuth",
          icon: "../../static/mine-user-auth.png"
        },
        {
          title: "查看贷款产品",
          url: "index",
          icon: "../../static/mine-product.png"
        },
        {
          title: "我报备的客户",
          url: "baobeiList",
          icon: "../../static/mine-mybaobei.png"
        },
        {
          title: "我的业务报单",
          url: "baodanList",
          icon: "../../static/mine-myWorkOrder.png"
        },
        {
          title: "修改密码",
          url: "register?type=2",
          icon: "../../static/mine-Pwd.png"
        },
        {
          title: "退出登录",
          url: "index",
          icon: "../../static/mine-logout.png"
        }
      ]
    };
  },
  onShow() {
    console.log(this.userInfo);
    this.phoneNum = this.userInfo.phoneNum.replace(
      /(\d{3})\d{4}(\d{4})/,
      "$1****$2"
    );
    this.$minApi
      .getBrokerDetail({ phoneNum: this.userInfo.phoneNum })
      .then(res => {
        if (res.code !== 1) {
          uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
          return;
        }
        this.data = res.data;
        console.log(JSON.stringify(this.data));
      })
      .catch(err => {
        uni.showModal({ title: "请求失败", content: err });
      });
  },
  methods: {
    ...mapMutations(["logout"]),
    handleLsitClick(item) {
      if (item.title === "退出登录") {
        // 退出
        uni.showModal({
          title: "确定要退出吗?",
          content: "",
          success: (res) => {
            if (res.confirm) {
              this.logout();
              uni.navigateTo({
                url: item.url
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else if (item.title === "经纪人认证") {
        if (
          this.data.status === 2 ||
          this.data.status === 3 ||
          this.data.status === 4
        ) {
          item.url = "auth?data=" + JSON.stringify(this.data);
          uni.navigateTo({
            url: item.url
          });
        }
      } else {
        uni.navigateTo({
          url: item.url
        });
      }
    }
  }
};
</script>

<style>
.page {
  overflow: hidden;
}
.img-view {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  /* position: relative; */
  width: 750upx;
  height: 356upx;
  padding: 0 30upx;
  box-sizing: border-box;
  background: url("../../static/mine-bg.jpg") no-repeat center center;
  background-size: 750upx 356upx;
}
.user-avatar {
  /* position: absolute;
  top: 50%;
  left: 30upx;
  transform: translateY(-50%); */
  width: 212upx;
  height: 148upx;
  background: url("../../static/star.png") no-repeat center center;
  background-size: 212upx 148upx;
}
.user-avatar image {
  display: block;
  width: 132upx;
  height: 132upx;
  border-radius: 50%;
  border: 14upx solid rgba(255, 255, 255, 0.6);
  margin: 0 auto;
}
.user-info {
  padding-left: 30upx;
  font-size: 32upx;
  color: #ffffff;
}
.user-info view {
  line-height: 72upx;
}
.list {
  padding: 0 30upx;
}
.list .list-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 120upx;
  line-height: 120upx;
  border-bottom: 1upx solid #dddddd;
  font-size: 28upx;
  color: #555555;
}
.list .list-item .list-text {
  flex: 1;
}
.list .list-item::after {
  content: "";
  display: block;
  width: 18upx;
  height: 29upx;
  margin-right: 30upx;
  background: url("../../static/arrow.png") no-repeat center center;
  background-size: 18upx 29upx;
}
.list .list-icon {
  display: block;
  width: 71upx;
  height: 71upx;
  margin: 0 30upx 0 20upx;
}
</style>