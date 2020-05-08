# bsy-sso-login 使用文档

> bsy-sso-login 是前端对接 SSO 登录的sdk。

## 快速开始

### 1. 安装

```
npm i -S bsy-sso-login
```
或者
```
yarn add bsy-sso-login
```

### 2. 在代码中使用

bsy-sso-login 本质上默认导出了一个异步的登录函数，所以你需要先在代码中引入它：

```
import ssoLogin from 'bsy-sso-sdk'
```

你需要传入以下参数：

```js
const ssoParams = {
  clientId: 'xxxx', // 平台的ID，找后端开发同学要
  baseUrl: 'https://x.x.x', // 平台的接口地址
  ssoLoginUrl: 'xxxx' // 业务平台的登录接口地址（通过SSO登录凭证换取token），例如：/mtrpc/digital/bs.digital.auth.Auth/Login
}

ssoLogin(ssoParams)
  .then(logining=>{ // 异步函数执行的结果是logining，意为是否正在登录
    console.log(logining)
  })
```

### 一个使用示例
在 React 项目的根组件中：
```js
// App.js
import React, { useEffect, useState } from 'react'
import Pages from './pages'
import { Spin } from 'antd'

import ssoLogin from 'bsy-sso-sdk'

const ssoParams = {
  clientId: process.env.REACT_APP_SSO_CLIENT_ID,
  baseUrl: process.env.REACT_APP_BASE_URL,
  ssoLoginUrl: '/mtrpc/digital/bs.digital.auth.Auth/Login'
}

const App = () => {
  const [logining, setlogining] = useState(true)

  useEffect(() => {
    ssoLogin(ssoParams).then(res => {
      setlogining(res)
    })
  }, [])

  return (
    <Spin spinning={logining} tip="正在获取SSO授权...">
      <Pages />
    </Spin>
  )
}

export default App
```


## SSO登录过程

![SSO登录过程](https://tva1.sinaimg.cn/large/007S8ZIlgy1gelj4es18vj312c0u0ad1.jpg)
