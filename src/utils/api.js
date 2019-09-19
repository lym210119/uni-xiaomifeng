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
    config.baseURL = 'http://192.168.10.34/erp'
  } else {
    console.log('运行在手机中')
  }
  return config
})

export default {
  // 这里统一管理api请求
  apis: {
    getProductList(data) {
      return minRequest.post('/Api/searchProducts', data)
    },
    getProductDetail(data) {
      return minRequest.post('/Api/getOneProduct', data)
    },
    getCityList(data) {
      return minRequest.post('/Api/getCities', data)
    },
    getCaptcha(data) {
      return minRequest.post('/Api/sendXmfSms', data)
    },
    verifySms(data) {
      return minRequest.post('/Api/verifySms', data)
    },
    submitDeclaration(data) {
      return minRequest.post('/Api/submitDeclaration', data)
    },
    uploadHousePic(data) {
      return minRequest.post('/Api/uploadHousePic', data)
    },
    submitDeclaration(data) {
      return minRequest.post('/Api/submitDeclaration', data)
    }
  }
}
