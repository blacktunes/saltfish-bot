import moment = require('moment')
import puppeteer = require('puppeteer')

export let browser: puppeteer.Browser

puppeteer
  .launch({
    headless: 'new',
    args: ['--no-sandbox']
  })
  .then(async (res) => {
    browser = res
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.log(time, '->', '[Bot][工具] puppeteer已启动')
  })
  .catch((err) => {
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.error(time, '->', '[Bot][工具] puppeteer启动失败')
    console.error(err)
  })

/**
 * 生成html文件id为main的dom截图
 * @returns 图片的base64字符串
 */
export const htmlToImage = async (
  /** html文件位置 */
  html_path: string,
  /** 需要传递的数据 */
  data?: any,
  /** A `selector` to query page for {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector} to query page for. */
  selector = 'div[id="main"]',
  /** Sets the viewport of the page. */
  viewport: puppeteer.Viewport = {
    width: 2560,
    height: 1440
  },
  /** 其它设置 */
  options?: {
    /** Navigation Parameter */
    page_option?: puppeteer.WaitForOptions
    /** 截图设置 */
    screenshot_option?: Omit<puppeteer.ScreenshotOptions, 'encoding'>
    /** 网页的console事件 */
    log_cb?: (e: puppeteer.ConsoleMessage) => void
  }
) => {
  if (!browser) {
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.log(time, '->', '[Bot][工具] puppeteer尚未启动')
    return
  }
  const page = await browser.newPage()
  await page.setViewport(viewport)

  if (options.log_cb) {
    page.on('console', (e: puppeteer.ConsoleMessage) => {
      options.log_cb(e)
    })
  }

  await page.evaluateOnNewDocument((_data) => {
    window['data'] = _data
  }, data)

  try {
    await page.goto(html_path, options.page_option)
  } catch (err) {
    await page.close()
    throw Error(err)
  }

  const form = await page.$(selector)
  const screenshot = await form.screenshot({
    type: 'jpeg',
    // quality: 90,
    encoding: 'base64',
    ...options.screenshot_option
  })
  await page.close()
  return `base64://${screenshot}`
}

export default htmlToImage
