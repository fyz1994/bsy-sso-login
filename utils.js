/**
 * HTTP请求
 * @param url
 * @param body
 * @returns {Promise}
 */
const request = async (url, body) => {
  return new Promise(function (resolve, reject) {
    let req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader('Content-type', 'application/json');
    req.withCredentials = true;

    req.onload = req.onreadystatechange = function () {
      if (!req.readyState || req.readyState === 4) {
        if (req.status === 200) {
          let res = JSON.parse(req.responseText);

          if (res['meta']['code'] === 0) {
            resolve(res)
          } else {
            reject("请确认参数是否正确，若参数无误，请联系翟飞查看微服务: " + res['meta']['error']);
          }
        }
      }
    };

    req.send(JSON.stringify(body))
  })
}

const getUrlParams = () => {
  const paramPairs = window.location.search.replace('?', '').split('&')
  const params = {}
  paramPairs.forEach(pair => {
    const key = pair.split('=')[0]
    const value = pair.split('=')[1]
    params[key] = value
  })
  return params
}

export {
  request,
  getUrlParams
}
