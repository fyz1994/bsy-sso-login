import { request } from '../utils'

// 使用URL中获取到的code去换取sso的登录凭证
const code2SsoToken = (clientId, tokenUrl, code) => {
  let body = {
    'client_id': clientId,
    code
  }

  let url = tokenUrl
  return request(url, body)
    .then(res => {
      return res.data
    })
}

export default code2SsoToken
