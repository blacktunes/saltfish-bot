import { BotPlugin, PluginConfig } from 'saltfish-bot'
import process = require('process')

interface config {
  user_id: number[]
}

export default class extends BotPlugin {
  name = '异常捕获'

  config: PluginConfig<config> = {
    user_id: []
  }

  init = () => {
    process.on('uncaughtException', (err) => {
      console.error('未捕获异常:', err)
      this.config.user_id.forEach((user_id) => {
        this.Bot.Api.sendPrivateMsg(
          user_id,
          `${this.Bot.Data.name}\n未捕获异常 - ${new Date().toLocaleString()}\n${err.stack}`
        )
      })
    })
  }
}
