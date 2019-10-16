<script>
import { mapMutations } from "vuex";
export default {
  onLaunch: function() {
    uni.getStorage({
      key: "uerInfo",
      success: res => {
        // console.log(res)
        this.login(res.data);
        // 如果还需要重新校验或是想要刷新token的有效时间 就再联网请求一次
        uni.request({
          url: `/erp/api/LoginOrOut`,
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            Token: res.data.token
          },
          data: {
            phoneNum: res.data.phoneNum,
            sessionId: res.data.sessionId
          },
          method: "POST",
          success: e => {
            if (e.statusCode === 200) {
              // console.log(e)
              if (e.data.code === 1) {
                this.login(e.data);
              }
              if (e.data.code === 4) {
                // console.log('tuichuaaa')
                this.logout()
              }
            }
          }
        });
      }
    });
  },
  methods: {
    ...mapMutations(["login", 'logout'])
  }
};
</script>

<style>
/*每个页面公共css */
/* page {
  background-color: #f5f5f5;
} */

</style>
