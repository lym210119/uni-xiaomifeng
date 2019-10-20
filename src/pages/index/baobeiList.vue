<template>
  <view class="page">
    <view class="search-bar" v-if="listData.length">
      <input
        class="search-input"
        type="text"
        confirm-type="search"
        placeholder="输入姓名或身份证号码后4位搜索"
      />
    </view>
    <view class="search-list" v-if="listData.length">
      <view class="list-item" v-for="item in listData" :key="item.KEYID">
        <view class="item-left">
          <view class="info">
            <text class="name">李阳明</text>
            <text class="idcard">420117********1252</text>
          </view>
          <view class="status"
            >离保护期截止日还有：<text class="end-date">14天</text></view
          >
        </view>
        <view class="item-right" @click="toDetail(item)">查看融资方案</view>
      </view>
    </view>
    <uniLoadMore
      :status="status"
      :content-text="contentText"
      v-if="listData.length"
    ></uniLoadMore>

    <view class="nodata" v-if="!listData.length">
      <image class="nodata-img" src="../../static/apply-fail.png"></image>
      <view class="no-text"
        >您尚未报备任何客户，赶紧报备自己的 客户抢占先机吧！</view
      >
      <view class="no-tips"
        >报备成功后，平台将会为您的客户设置为期
        <text>15天</text> 的客户保护期</view
      >
      <view class="no-button" @click="toBaobei()">报备客户，抢占先机</view>
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
      listData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      reload: false,
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多"
      },
      page: 0,
      onOff: true
    };
  },
  onLoad() {
    this.getList();
  },
  onPullDownRefresh() {
    this.reload = true;
    this.page = 1;
    this.getList();
  },
  onReachBottom() {
    console.log('onReachBotton')
    this.status = "more";
    this.page++;
    this.getList();
  },
  methods: {
    getList() {
      var data = {
        userId: this.userInfo.phoneNum,
        page: this.page
      };
      this.$minApi
        .getBaobeiList(data)
        .then(res => {
          uni.stopPullDownRefresh();
          console.log(res)
          // if (data.statusCode == 200) {
            if (!res.length) {
              this.status = "nomore";
              return;
            }
            let list = res;
            this.listData = this.reload ? list : this.listData.concat(list);
            this.reload = false;
          // }
        })
        .catch(err => {
          uni.showModal({ title: "请求失败", content: JSON.stringify(err) });
        });
      // uni.request({
      //   // url: 'https://unidemo.dcloud.net.cn/api/news',
      //   url: `${this.$serverUrl}/erp/api/cus_list`,
      //   data: data,
      //   method: "POST",
      //   success: data => {
      //     console.log(data);
      //     uni.stopPullDownRefresh();
      //     if (data.statusCode == 200) {
      //       if (!data.data.length) {
      //         this.status = "nomore";
      //         return;
      //       }
      //       let list = this.setTime(data.data);
      //       this.listData = this.reload ? list : this.listData.concat(list);
      //       this.reload = false;
      //     }
      //   },
      //   fail: (data, code) => {
      //     console.log("fail" + JSON.stringify(data));
      //   }
      // });
    },
    toDetail(e) {
      uni.navigateTo({
        url:
          "baobeiDetail?detailDate=" + encodeURIComponent(JSON.stringify(e))
      });
    },
    toBaobei() {
      uni.navigateTo({
        url: "baobei"
      });
    }
  }
};
</script>

<style>
.page {
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
.search-list {
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
  border-radius: 30upx;
  background: #d99d40;
  color: #ffffff;
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
</style>