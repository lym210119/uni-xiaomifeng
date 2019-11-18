<template>
  <view class="content">
    <view class="product-list">
      <productItem
        :key="item.id"
        :item="item"
        v-for="item in productList"
        @click.native="toDetail(item.id)"
      ></productItem>
    </view>

    <view class="bottom-text">
      <!-- <view>到底啦！更多产品敬请期待！</view> -->
      <view>{{ loadingText }}</view>
      <view
        >商务合作：<text class="text-phoneNum">{{ company.tel }}</text></view
      >
    </view>

    <!-- <view class="fab-button" @click.stop="tobaobei()">
			<view class="cus-btn">
				<text class="fab-text">客户</text>
				<text class="fab-text">报备</text>
			</view>
			<view class="mine-btn" @click.stop="tobaobei()">
				<text class="fab-text">个人</text>
				<text class="fab-text">中心</text>
			</view>
		</view> -->
    <fabButton :is-index="true"></fabButton>
  </view>
</template>

<script>
import productItem from "../../components/productItem";
import fabButton from "../../components/fabButton";
import { mapMutations } from "vuex";
export default {
  components: {
    productItem,
    fabButton
  },
  data() {
    return {
      loadingText: "正在努力加载...",
      // loadingStatus: 0,
      reload: false,
      // loadingStatus: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
      // contentText: {
      //     contentdown:'上拉显示更多',
      //     contentrefresh: '正在加载...',
      //     contentnomore: '没有更多数据了'
      // },
      productList: [],
      page: 1,
      timer: null,
      isIndex: true,
      company: {}
    };
  },
  onLoad(opts) {
    this.getCompany();
    this.getProductList();
  },
  onPullDownRefresh() {
    this.reload = true;
    this.page = 1;
    this.getProductList();
  },
  onReachBottom() {
    console.log("上啦加载。。");
    // this.status = "more";
    this.page++;
    this.loadingText = "正在努力加载中...";
    this.getProductList();
  },
  methods: {
    ...mapMutations(["setCom"]),
    // getMore() {
    //   if (this.loadingStatus !== 0) {
    //     //loadingStatus!=0;直接返回
    //     return false;
    //   }
    //   this.loadingStatus = 1;
    //   // uni.showNavigationBarLoading();//显示加载动画
    //   this.$minApi.getProductList({ page: this.page }).then(res => {
    //     console.log(JSON.stringify(res));
    //     if (!res.res.length) {
    //       //没有数据
    //       this.loadingStatus = 2;
    //       this.loadingText = "到底啦！更多产品敬请期待！";
    //       return;
    //     }
    //     this.page++; //每触底一次 page +1
    //     var data = res.res.map(element => {
    //       element.iconFile =
    //         this.imgBaseUrl + element.iconFile;
    //       return element;
    //     });
    //     this.productList = this.productList.concat(data); //将数据拼接在一起
    //     this.loadingStatus = 0; //将loadingStatus归0重置
    //     // uni.hideNavigationBarLoading();//关闭加载动画
    //   });
    // },
    getProductList(type) {
      // this.page = 1;
      // this.loadingStatus = 0;
      this.$minApi
        .getProductList({ page: this.page })
        .then(res => {
          // this.res = res
          console.log(res);
          uni.stopPullDownRefresh();
          // if (res.code === "100") {
          if (res.res.length < 12) {
            this.loadingText = "到底啦！更多产品敬请期待！";
          }
          var data = res.res.map(element => {
            element.iconFile = this.imgBaseUrl + element.iconFile;
            return element;
          });
          this.productList = this.reload ? data : this.productList.concat(data);
          console.log(this.productList);
          this.reload = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    toDetail(id) {
      console.log(id);
      uni.navigateTo({
        url: "detail?id=" + id
      });
    },
    getCompany() {
      this.$minApi
        .getCompany()
        .then(res => {
          if (res.code === 1) {
            this.setCom(res.data);
            this.company = res.data
          }
        })
        .catch(err => {
          uni.showModal({ title: "网络错误", content: JSON.stringify(err) });
        });
    },
    toMine() {
      uni.navigateTo({
        url: "mine"
      });
    }
  }
};
</script>

<style>
.content {
  background-color: #f5f5f5;
}
.bottom-text {
  margin: 20px 0;
  text-align: center;
  font-size: 26upx;
}
.text-phoneNum {
  color: #d99d40;
}
</style>
