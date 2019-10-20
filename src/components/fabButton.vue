<template>
  <view class="fab-btn">
    <view
      :class="isIndex ? 'fab-button' : 'fab-button index-btn'"
      @click.stop="isIndex ? toBaobei() : toIndex()"
    >
      <text class="fab-text">{{ isIndex ? "客户报备" : "主页" }}</text>
    </view>
    <view class="fab-button" @click.stop="toMine()">
      <text class="fab-text">个人中心</text>
    </view>
    <view class="fab-button back-btn" @click.stop="toBack()" v-if="!isIndex">
      <text class="fab-text">返回</text>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: mapState(["hasLogin", "usrInfo"]),
  props: {
    isIndex: Boolean
  },
  methods: {
    toIndex() {
      uni.navigateTo({
        url: "index"
      });
    },
    toBaobei() {
      if (this.hasLogin) {
        uni.navigateTo({
          url: "baobei"
        });
      } else {
        uni.navigateTo({
          url: "login"
        });
      }
    },
    toMine() {
      console.log(this.hasLogin);
      if (this.hasLogin) {
        uni.navigateTo({
          url: "mine"
        });
      } else {
        uni.navigateTo({
          url: "login"
        });
      }
    },
    toBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style>
.fab-btn {
  position: fixed;
  right: 30upx;
  bottom: 120upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.fab-button {
  width: 90upx;
  height: 90upx;
  /* line-height: 45upx; */
  margin-bottom: 20upx;
  border-radius: 50%;
  box-shadow: 2upx 2upx 10upx 0 rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
  z-index: 99;
}
.fab-button:first-child {
  background-color: #e2ab51;
}
.fab-button.index-btn .fab-text {
  line-height: 90upx;
  padding: 0;
}
.fab-button:first-child .fab-text {
  color: #ffffff;
}
.fab-button.back-btn .fab-text {
  line-height: 90upx;
  padding: 0;
}
.fab-text {
  display: block;
  padding: 10upx;
  text-align: center;
  font-size: 26upx;
  color: #e2ab51;
}
</style>