// 全局的路由
global.antRouter = ''
// 这个函数 网上  随处可见，我也是应用了别人的。
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

// 删除左右两端的空格
export function trim(str) {
  return str.toString().replace(/(^\s*)|(\s*$)/g, '')
}
