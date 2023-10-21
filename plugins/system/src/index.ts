import { htmlToImage } from '@saltfish-bot/puppeteer'
import { cpu, mem } from 'node-os-utils'
import { BotPlugin, secondsFormat } from 'saltfish-bot'
import path = require('path')

export default class System extends BotPlugin {
  name = 'system'

  init = () => {
    this.Command.command('#sys')
      .alias('#服务器状态')
      .admin()
      .desc('查询服务器状态')
      .action('group', async (e) => {
        const cpuUsage = await cpu.usage()
        const memInfo = await mem.info()
        const img = await htmlToImage(`file://${path.join(__dirname, 'index.html')}`, {
          name: this.Bot.Data.name,
          time: secondsFormat(Math.floor(process.uptime())),
          plugin: this.Bot.Plugin.list.length,
          command: this.Bot.Command.list.length,
          listener: this.Bot.Conn.getEventNum(),
          message: this.Bot.Conn.getMessageNum(),
          cpu: `${cpuUsage}%`,
          mem: [
            `${((memInfo.usedMemMb / memInfo.totalMemMb) * 100.0).toFixed(2)}%`,
            `${((process.memoryUsage().rss / 1024 / 1024 / memInfo.totalMemMb) * 100.0).toFixed(
              2
            )}%`
          ]
        })
        this.Bot.Api.sendGroupMsg(e.group_id, this.Bot.CQCode.image(img))
        return true
      })
  }
}
