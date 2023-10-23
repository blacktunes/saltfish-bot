# @saltfish-bot/plugin-system

**咸鱼BOT所使用的插件，可以获取运行咸鱼BOT的设备状态**

> 默认指令为 **#system**

```ts
import App from 'saltfish-bot'
import system from '@saltfish-bot/plugin-system'

const app = new App()
app
  .plugin(Sys, {
    // 指令
    command: '#system',
    // 是否需要管理员
    admin: true
  })
  .start()
```
