import moment = require('moment')
import puppeteer = require('puppeteer')

export let browser: puppeteer.Browser

puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox']
})
  .then(async res => {
    browser = res
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.log(time, '->', '[Bot][工具] puppeteer已启动')
  })
  .catch(err => {
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.error(time, '->', '[Bot][工具] puppeteer启动失败')
    console.error(err)
  })

export const getImg = async (
  html_path: string,
  data?: any,
  viewport: puppeteer.Viewport = {
    width: 2560,
    height: 1440
  },
  option?: puppeteer.WaitForOptions,
  log_cb?: (e: puppeteer.ConsoleMessage) => void,
  screenshotOption?: Omit<puppeteer.ScreenshotOptions, 'encoding'>
) => {
  if (!browser) {
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.log(time, '->', '[Bot][工具] puppeteer尚未启动')
    return
  }
  const page = await browser.newPage()
  await page.setViewport(viewport)

  if (log_cb) {
    page.on('console', (e: puppeteer.ConsoleMessage) => {
      log_cb(e)
    })
  }

  await page.evaluateOnNewDocument(_data => {
    window['data'] = _data
  }, data)

  try {
    await page.goto(html_path, option)
  } catch (err) {
    await page.close()
    throw Error(err)
  }

  const form = await page.$('div[id="main"]')
  const screenshot = await form.screenshot({
    type: 'jpeg',
    // quality: 90,
    encoding: 'base64',
    ...screenshotOption
  })
  await page.close()
  return `base64://${screenshot}`
}

export default getImg
