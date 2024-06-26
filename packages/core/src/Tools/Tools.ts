/**
 * 格式化Date对象
 * @param date Date对象
 */
export const getTime = (date: any) => {
  return {
    date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
    time: `${date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours()}:${
      date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes()
    }:${date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds()}`
  }
}

/**
 * 使用await暂停运行
 * @param {number} interval 暂停秒数
 */
export const sleep = (interval: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, interval * 1000)
  })
}

/**
 * 格式化秒
 */
export const secondsFormat = (s: number) => {
  const day = Math.floor(s / (24 * 3600))
  const hour = Math.floor((s - day * 24 * 3600) / 3600)
  const minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60)
  const second = s - day * 24 * 3600 - hour * 3600 - minute * 60
  return `${day ? day + '天' : ''}${hour ? hour + '小时' : ''}${minute ? minute + '分钟' : ''}${
    second ? second.toFixed(0) + '秒' : ''
  }`
}

/**
 * 时间天数差
 */
export const timeDifference = (startTime: Date, endTime?: Date) => {
  startTime = new Date(startTime.setHours(0, 0, 0, 0))
  if (endTime) {
    endTime = new Date(endTime.setHours(0, 0, 0, 0))
  } else {
    endTime = new Date(new Date().setHours(0, 0, 0, 0))
  }
  const diff = endTime.getTime() - startTime.getTime()
  const day = Math.floor(Math.abs(diff) / (24 * 3600 * 1000))
  return day > 0 ? `${day}天${diff > 0 ? '前' : '后'}` : '今天'
}

/**
 * 特殊字符，转义，避免冲突
 * @param {string} code 要转义的字符串
 * @param {boolean} [isComma=true] 是否转义逗号，默认为true
 * @returns {string} 转义后的字符串
 */
export const encode = (code: string, isComma: boolean = true): string => {
  code = code.replaceAll('&', '&amp;')
  code = code.replaceAll('[', '&#91;')
  code = code.replaceAll(']', '&#93;')
  if (isComma) {
    code = code.replaceAll(',', '&#44;')
  }
  return code
}

/**
 * 特殊字符，反转义
 * @param {string} code stringReplace
 * @returns {string} 反转义后的字符串
 */
export const decode = (code: string): string => {
  code = code.replaceAll('&amp;', '&')
  code = code.replaceAll('&#91;', '[')
  code = code.replaceAll('&#93;', ']')
  code = code.replaceAll('&#44;', ',')
  return code
}
