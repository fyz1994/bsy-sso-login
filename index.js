
import { request, getUrlParams } from './utils'
import redirect2Sso from './functions/redirect2Sso'
import code2SsoToken from './functions/code2SsoToken'

const USER_INFO_KEY = 'user-info'

const defaultStoreUserInfoCallback = (userInfo) => {
  window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

const cleanAuthUrl = () => {
  const authUrl = window.location.href
  window.location.href = authUrl.replace(window.location.search, '')
}

const login = async (loginUrl, clientId, token, storeUserInfoCallback) => {
  return request(loginUrl, {
    clientID: clientId,
    ssoToken: token
  }).then(({ data }) => {
    const callback = storeUserInfoCallback || defaultStoreUserInfoCallback
    cleanAuthUrl()
    callback(data)
  })
}

const ssoLogin = async ({ clientId, baseUrl, ssoLoginUrl, storeUserInfoCallback }) => {
  const ossoPoint = {
    loginUrl: baseUrl + "/mtrpc/default/osso.Osso/GetAuthURL",
    tokenUrl: baseUrl + "/mtrpc/default/osso.Osso/GetToken",
    refreshUrl: baseUrl + "/mtrpc/default/osso.Osso/RefreshToken",
  }

  // 判断本地是否存在token
  const userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY))

  // 存在——>登录完成
  if (userInfo && userInfo.token) {
    return Promise.resolve(false)
  } else { // 不存在——>获取token
    const params = getUrlParams()
    const isAuthUrl = params.state && params.code && params.session_state

    // 判断是否是回调url
    if (isAuthUrl) {
      // 是回调url，使用URL中获取到的code去换取sso的登录凭证
      return code2SsoToken(clientId, ossoPoint.tokenUrl, params.code)
        .then(res => {
          login(baseUrl + ssoLoginUrl, clientId, res.access_token, storeUserInfoCallback)
            .then(_ => {
              return Promise.resolve(false)
            })
          return Promise.resolve(true)
        }).catch(_ => {
          window.localStorage.clear()
          redirect2Sso(ossoPoint.loginUrl, clientId)
        })
    } else {
      // 不是回调url，重定向到sso授权页面
      redirect2Sso(ossoPoint.loginUrl, clientId)
      return Promise.resolve(true)
    }
  }
}

export default ssoLogin
