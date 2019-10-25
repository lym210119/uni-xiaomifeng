<template>
  <view class="page">
    <view class="nodata" v-if="nodata">
      <image class="nodata-img" src="../../static/apply-fail.png"></image>
      <view class="no-text">您尚无任何报单！</view>
      <view class="ad-box">
        <view class="qrcode">
          <image class="qrcode-img" src="../../static/qrcode.png"></image>
          <view class="qrcode-text">扫码关注公众号</view>
        </view>
        <view class="company">
          <view class="first-text">为用户提供一站式智能科技金融服务</view>
          <view>武汉融宝科技有限公司提供服务支持</view>
          <view>商务合作：李经理 18672394979</view>
        </view>
      </view>
    </view>
    <view class="box" v-else>
      <view class="search-bar">
        <input
          class="search-input"
          type="text"
          v-model="keyword"
          confirm-type="search"
          @confirm="handleSearch"
          placeholder="输入姓名或身份证号码后4位搜索"
        />
      </view>

      <view class="search-nodata" v-if="searchNodata">
        <image class="nodata-img" src="../../static/apply-fail.png"></image>
        <view class="no-text">无该客户报单信息！</view>
        <view class="ad-box">
          <view class="qrcode">
            <image class="qrcode-img" src="../../static/qrcode.png"></image>
            <view class="qrcode-text">扫码关注公众号</view>
          </view>
          <view class="company">
            <view class="first-text">为用户提供一站式智能科技金融服务</view>
            <view>武汉融宝科技有限公司提供服务支持</view>
            <view>商务合作：李经理 18672394979</view>
          </view>
        </view>
      </view>

      <view class="search-list" v-else>
        <view
          class="list-item"
          v-for="item in listData"
          :key="item.id"
          @click="toDetail(item.id)"
        >
          <view class="item-left">
            <view class="info">
              <text class="name">{{ item.cusName }}</text>
              <text class="idcard">{{ item.IdNumber }}</text>
            </view>
          </view>
          <view class="item-right">{{baodanStatus[item.status - 1].title}}</view>
        </view>
      </view>

      <uniLoadMore
        :status="status"
        :content-text="contentText"
        v-if="!searchNodata"
      ></uniLoadMore>
    </view>

    <fabButton></fabButton>
  </view>
</template>

<script>
import fabButton from "../../components/fabButton";
import uniLoadMore from "@/components/uni-load-more";
import { mapState } from "vuex";
export default {
  components: {
    fabButton,
    uniLoadMore
  },
  computed: mapState(["userInfo"]),
  data() {
    return {
      nodata: false,
      searchNodata: false,
      listData: [],
      keyword: "",
      reload: false,
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多"
      },
      page: 1,
      onOff: true,
      baodanStatus: [{
        title: '报备中',
        value: 1
      },{
        title: '报单中',
        value: 2
      },{
        title: '审核中',
        value: 3
      },{
        title: '做单中',
        value: 4
      },{
        title: '已结单',
        value: 5
      },{
        title: '已退件',
        value: 6
      }]
    };
  },
  onLoad() {
    uni.showLoading();
    this.getList("onload");
  },
  onPullDownRefresh() {
    this.reload = true;
    this.page = 1;
    // uni.showLoading({ title: "加载中..." });
    this.getList();
  },
  onReachBottom() {
    // console.log("onReachBotton");
    this.status = "more";
    this.page++;
    // uni.showLoading({ title: "加载中..." });
    this.getList();
  },
  methods: {
    handleSearch(e) {
      // console.log(e);
      this.listData = [];
      this.page = 1;
      this.getList("search");
      uni.hideKeyboard();
    },
    getList(flag) {
      var data = {
        phoneNum: this.userInfo.phoneNum,
        type: 2,
        page: this.page,
        keyword: this.keyword
      };
      this.$minApi
        .getBaobeiList(data)
        .then(res => {
          uni.stopPullDownRefresh();
          // console.log(res);
          uni.hideLoading();
          if (res.code !== 1 && res.code !== 3) {
            uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
            return;
          }
          // if (data.statusCode == 200) {
          if (res.data.length < 10) {
            this.status = "nomore";
            if (!res.data.length && flag === "search") {
              this.searchNodata = true;
            } else if (!res.data.length && flag === "onload") {
              this.nodata = true;
            } else {
              this.searchNodata = false;
            }
          }
          let list = this.setData(res.data);
          // console.log(list);
          this.listData = this.reload ? list : this.listData.concat(list);
          this.reload = false;
          // }
        })
        .catch(err => {
          uni.showModal({ title: "请求失败", content: JSON.stringify(err) });
        });
    },
    setData(data) {
      let list = data.map(item => {
        item.IdNumber =
          item.IdNumber.substr(0, 6) +
          new Array(item.IdNumber.length - 9).join("*") +
          item.IdNumber.substr(-4);

        item.phone =
          item.phone.substr(0, 3) +
          new Array(item.phone.length - 6).join("*") +
          item.phone.substr(-4);

        let timeDiff =
          new Date(item.expirationTime.replace(/\-/g, "/")).getTime() -
          new Date().getTime();
        if (timeDiff <= 0) {
          item.pastdue = "报备过期";
        }
        let endDate = parseInt(timeDiff / 1000 / 60 / 60 / 24);
        item.endDate = endDate + "天";
        if (endDate <= 0) {
          endDate = parseInt(timeDiff / 1000 / 60 / 60);
          item.endDate = endDate + "小时";
          if (endDate <= 0) {
            endDate = parseInt(timeDiff / 1000 / 60);
            item.endDate = endDate + "分钟";
          }
        }
        return item;
      });
      return list;
    },
    toDetail(id) {
      // console.log(e)
      uni.navigateTo({
        url: "baodanDetail?id=" + id
      });
    },
  }
};
</script>

<style>
.page,
.box {
  height: 100%;
  overflow: hidden;
}
.search-bar {
  position: fixed;
  width: 100%;
  padding: 25upx 30upx;
  box-sizing: border-box;
  background: #ffffff;
  border-bottom: 1upx solid #dddddd;
}
.search-input {
  height: 60upx;
  padding: 0 30upx 0 60upx;
  background: url("../../static/search-icon.png") no-repeat 20upx center #eeeeee;
  background-size: 25upx 25upx;
  border-radius: 30upx;
  font-size: 28upx;
}
.search-list,
.search-nodata {
  margin-top: 135upx;
  padding: 0 30upx 0;
}
.list-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20upx 10upx 20upx 22upx;
  margin-bottom: 25upx;
  border-radius: 12upx;
  box-shadow: 2upx 2upx 10upx 0 rgba(0, 0, 0, 0.3);
  font-size: 28upx;
  color: #808080;
}
.item-left view {
  line-height: 60upx;
}
.info .name {
  display: inline-block;
  width: 140upx;
  color: #333333;
}
.status .end-date {
  color: #333333;
}
.item-right {
  padding: 10upx 20upx;
  /* border-radius: 30upx;
  background: #d99d40; */
  color: #333333;
}

.nodata {
  padding: 0 30upx;
}
.nodata-img {
  display: block;
  width: 438upx;
  height: 258upx;
  margin: 50upx auto;
}
.no-text {
  padding: 0 30upx;
  text-align: center;
  font-size: 36upx;
  color: #333333;
}
.no-tips {
  padding: 10upx 70upx 30upx;
  text-align: center;
  font-size: 28upx;
  color: #848484;
}
.no-tips text {
  color: #333;
}
.no-button {
  height: 77upx;
  line-height: 77upx;
  margin: 0 30upx;
  border-radius: 50upx;
  background: #d99d40;
  text-align: center;
  font-size: 32upx;
  color: #ffffff;
}
.ad-box {
  position: relative;
  height: 470upx;
  margin: 250upx 30upx 30upx 30upx;
  border-top: 1px solid #e4b22f;
  border-bottom: 1px solid #e4b22f;
  font-size: 28upx;
  color: #949494;
}
.ad-box::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -24upx;
  transform: translateX(-50%);
  border-left: 12upx solid transparent;
  border-top: 12upx solid transparent;
  border-right: 12upx solid transparent;
  border-bottom: 12upx solid #e4b22f;
}
.ad-box::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -24upx;
  transform: translateX(-50%);
  border-left: 12upx solid transparent;
  border-bottom: 12upx solid transparent;
  border-right: 12upx solid transparent;
  border-top: 12upx solid #e4b22f;
}
.qrcode {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 48upx;
}
.qrcode-img {
  width: 168upx;
  height: 168upx;
  border: 16upx solid #e4b22f;
}
.qrcode-text {
  line-height: 34upx;
  font-size: 22upx;
  color: #949494;
}
.company {
  text-align: center;
  color: #949494;
}
.company view {
  line-height: 40upx;
  font-size: 24upx;
}
.company .first-text {
  height: 80upx;
  line-height: 80upx;
  font-size: 28upx;
  color: #333;
}
</style>