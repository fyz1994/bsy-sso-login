import { request } from '../utils'

// 重定向到sso授权页面
const redirect2Sso = (url, clientId) => {
  request(url, { client_id: clientId })
    .then(res => {
      window.location.href = res['data']['auth_url']
    })
    .catch(error => {
      console.error(error)
    })
}

export default redirect2Sso
