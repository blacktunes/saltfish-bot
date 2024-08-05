import { BotPlugin } from 'saltfish-bot'

export default class extends BotPlugin {
  static name = '脚本执行'
  script: boolean = false

  init = () => {
    this.Bot.Event.on('message.group', (e) => {
      if (this.Bot.Admin.isAdmin(e.user_id)) {
        if (e.message.startsWith('#script\n') || e.message.startsWith('#script\r')) {
          const script = e.message.replace('#script\n', '').replace('#script\r', '')
          try {
            const result = String(JSON.stringify(eval(`(() => (${script}))()`)))
            this.Bot.Api.sendGroupMsg(e.group_id, `√ Result: \n> ${result.replace(/\n/g, '\n> ')}`)
          } catch (error) {
            this.Bot.Api.sendGroupMsg(
              e.group_id,
              `× Error: \n> ${error.toString().replace(/\n/g, '\n> ')}`
            )
          }
          return
        }
        if (e.message === '#script') {
          if (this.script) {
            this.script = false
            this.Bot.Api.sendGroupMsg(e.group_id, '> Script Mode OFF')
          } else {
            this.script = true
            this.Bot.Api.sendGroupMsg(e.group_id, '> Script Mode ON')
          }
          return true
        }
        if (this.script) {
          try {
            const result = String(JSON.stringify(eval(e.message)))
            this.Bot.Api.sendGroupMsg(e.group_id, `√ Result: \n> ${result.replace(/\n/g, '\n> ')}`)
          } catch (error) {
            this.Bot.Api.sendGroupMsg(
              e.group_id,
              `× Error: \n> ${error.toString().replace(/\n/g, '\n> ')}`
            )
          }
          return true
        }
      }
    })
  }
}
