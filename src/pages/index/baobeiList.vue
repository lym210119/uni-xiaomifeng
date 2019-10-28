<template>
  <view class="page">    
    <view class="nodata" v-if="nodata">
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
        <view class="no-text"
          >您尚未报备该客户，赶紧报备客户抢 占先机吧！
        </view>
        <view class="no-tips"
          >报备成功后，平台将会为您的客户设置为期
          <text>15天</text> 的客户保护期</view
        >
        <view class="no-button" @click="toBaobei()">报备客户，抢占先机</view>
      </view>
      <view class="search-list" v-else>
        <view class="list-item" v-for="item in listData" :key="item.id">
          <view class="item-left">
            <view class="info">
              <text class="name">{{ item.cusName }}</text>
              <text class="idcard">{{ item.IdNumber }}</text>
            </view>
            <view class="status" v-if="item.pastdue">{{ item.pastdue }}</view>
            <view class="status" v-else
              >离保护期截止日还有：<text class="end-date">{{
                item.endDate
              }}</text></view
            >
          </view>
          <view class="item-right" @click="toDetail(item.id)"
            >{{planArr[item.pairingState]}}</view
          >
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
      planArr: ['', '方案设计中', '已出方案', '无方案'],
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
      onOff: true
    };
  },
  onLoad() {
    uni.showLoading();
    this.getList('onload');
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
      this.getList('search');
      uni.hideKeyboard();
    },
    getList(flag) {
      var data = {
        phoneNum: this.userInfo.phoneNum,
        type: 1,
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
            if (!res.data.length && flag === 'search') {
              this.searchNodata = true
            }else if (!res.data.length && flag === 'onload') {
              this.nodata = true
            } else {
              this.searchNodata = false
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
        url: "baobeiDetail?id=" + id
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
.search-list, .search-nodata {
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