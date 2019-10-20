import MinRequest from './MinRequest'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request(request => {
  return request
})

// 响应拦截器
minRequest.interceptors.response(response => {
  return response.data
})

// 设置默认配置
minRequest.setConfig(config => {
  if (uni.getSystemInfoSync().platform === 'devtools') {
    console.log('运行在开发工具上')
    config.baseURL = 'http://192.168.10.208:8088'
  } else {
    console.log('运行在手机中')
  }
  return config
})

export default {
  // 这里统一管理api请求
  apis: {
    // 获取报备列表
    getBaobeiList(data) {
      return minRequest.post('/erp/Api/cus_list', data)
    },
    // 提交报备
    submitBaobei(data) {
      return minRequest.post('/erp/Api/submitCusReport', data)
    },
    // 获取认证详情
    getBrokerDetail(data) {
      return minRequest.post('/erp/Api/getBrokerDetail', data)
    },
    // 认证提交
    submitTrustInfo(data) {
      return minRequest.post('/erp/Api/submitTrustInfo', data)
    },
    // 修改密码
    updatePassword(data) {
      return minRequest.post('/erp/Api/updatePassword', data)
    },
    // 登录验证

    // 登录
    brokerLogin(data) {
      return minRequest.post('/erp/Api/brokerLogin', data)
    },
    // 注册
    brokerRegister(data) {
      return minRequest.post('/erp/Api/brokerRegister', data)
    },
    getProductList(data) {
      return minRequest.post('/erp/Api/searchProducts', data)
    },
    getProductDetail(data) {
      return minRequest.post('/erp/Api/getOneProduct', data)
    },
    getCityList(data) {
      return minRequest.post('/erp/Api/getCities', data)
    },
    getCaptcha(data) {
      return minRequest.post('/erp/Api/sendXmfSms', data)
    },
    verifySms(data) {
      return minRequest.post('/erp/Api/verifySms', data)
    }

    // uploadHousePic(data) {
    //   return minRequest.post('/erp/Api/uploadHousePic', data)
    // },
    // submitDeclaration(data) {
    //   return minRequest.post('/erp/Api/submitDeclaration', data)
    // },
  }
}
