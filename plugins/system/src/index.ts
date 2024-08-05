import { BotPlugin } from 'saltfish-bot'
import { cpu, mem } from 'node-os-utils'
import si = require('systeminformation')
import { htmlToImage } from '@saltfish-bot/puppeteer'
import path = require('path')

export default class System extends BotPlugin {
  static name = 'system'

  init = () => {
    this.Command.command('#help')
      .desc('查看所有可用指令')
      .action('group', async (e) => {
        setTimeout(async () => {
          const commands: {
            [name: string]: {
              name: string[]
              reg?: string
              admin?: boolean
              desc?: string
            }[]
          } = {}
          const _bot: {
            name: string[]
            reg?: string
            admin?: boolean
            desc?: string
          }[] = []
          this.Bot.Command.list.forEach((item) => {
            if (item.group) {
              const plugin = this.Bot.Plugin.getPlugin<BotPlugin>(item.group)
              const blacklist = plugin?.blacklist || {}
              const whitelist = plugin?.whitelist || {}

              if (
                !(
                  (blacklist.group && blacklist.group.has(e.group_id)) ||
                  (blacklist.user && blacklist.user.has(e.user_id)) ||
                  (whitelist.group && !whitelist.group.has(e.group_id)) ||
                  (whitelist.user && !whitelist.user.has(e.user_id))
                ) &&
                !(
                  (item.blacklist.group && item.blacklist.group.has(e.group_id)) ||
                  (item.blacklist.user && item.blacklist.user.has(e.user_id)) ||
                  (item.whitelist.group && !item.whitelist.group.has(e.group_id)) ||
                  (item.whitelist.user && !item.whitelist.user.has(e.user_id))
                ) &&
                ((item.admin && this.Bot.Admin.isAdmin(e.user_id)) || !item.admin)
              ) {
                if (!(item.group in commands)) {
                  commands[item.group] = []
                }
                commands[item.group].push({
                  name: item.comm,
                  reg: item.reg ? String(item.reg) : undefined,
                  admin: item.admin,
                  desc: item.desc
                })
              }
            } else {
              if (
                !(
                  (item.blacklist.group && item.blacklist.group.has(e.group_id)) ||
                  (item.blacklist.user && item.blacklist.user.has(e.user_id)) ||
                  (item.whitelist.group && !item.whitelist.group.has(e.group_id)) ||
                  (item.whitelist.user && !item.whitelist.user.has(e.user_id))
                ) &&
                ((item.admin && this.Bot.Admin.isAdmin(e.user_id)) || !item.admin)
              ) {
                _bot.push({
                  name: item.comm,
                  reg: item.reg ? String(item.reg) : undefined,
                  admin: item.admin,
                  desc: item.desc
                })
              }
            }
          })

          if (_bot.length > 0) {
            commands._bot = _bot
          }

          const img = await htmlToImage(
            `file://${path.join(__dirname, 'help/index.html')}`,
            commands
          )

          this.Bot.Api.sendGroupMsg(e.group_id, this.Bot.CQCode.image(img))
        })

        return true
      })

    this.Command.command('#bot')
      .alias('#BOT状态')
      .admin()
      .desc('查看BOT状态')
      .action('group', (e) => {
        setTimeout(async () => {
          const commands: {
            [name: string]: {
              name: string
              reg?: string
              admin?: boolean
            }[]
          } = {}
          const _bot: {
            name: string
            reg?: string
            admin?: boolean
          }[] = []
          this.Bot.Command.list.forEach((item) => {
            if (item.group) {
              if (!(item.group in commands)) {
                commands[item.group] = []
              }
              commands[item.group].push({
                name: item.comm[0],
                reg: item.reg ? String(item.reg) : undefined,
                admin: item.admin
              })
            } else {
              _bot.push({
                name: item.comm[0],
                reg: item.reg ? String(item.reg) : undefined,
                admin: item.admin
              })
            }
          })

          if (_bot.length > 0) {
            commands._bot = _bot
          }

          const img = await htmlToImage(`file://${path.join(__dirname, 'bot/index.html')}`, {
            name: this.Bot.Data.name,
            time: process.uptime(),
            memory: (process.memoryUsage().rss / 1024 / 1024).toFixed(1),
            message: this.Bot.Conn.getMessageNum(),
            plugins: this.Bot.Plugin.list.map((item) => item.name),
            commands,
            events: this.Bot.Conn.getEventInfo()
          })

          this.Bot.Api.sendGroupMsg(e.group_id, this.Bot.CQCode.image(img))
        }, 0)

        return true
      })

    this.Command.command('#sys')
      .alias('#服务器状态')
      .admin()
      .desc('查看服务器状态')
      .action('group', (e) => {
        setTimeout(async () => {
          const cpuUsage = await cpu.usage()
          const memInfo = await mem.info()
          await si.networkStats()
          const network = await si.networkStats()
          const processes = (await si.processes()).list
            .sort((a, b) => b.memRss - a.memRss)
            .slice(0, 5)

          const img = await htmlToImage(`file://${path.join(__dirname, 'sys/index.html')}`, {
            cpu: cpuUsage,
            men: {
              total: memInfo.totalMemMb,
              used: memInfo.usedMemMb,
              percentage: memInfo.usedMemPercentage
            },
            network: {
              up: network[0].tx_sec,
              down: network[0].rx_sec
            },
            processes
          })

          this.Bot.Api.sendGroupMsg(e.group_id, this.Bot.CQCode.image(img))
        }, 0)

        return true
      })
  }
}
