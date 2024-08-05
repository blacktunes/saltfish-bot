# @saltfish-bot/plugin-error-catch

**咸鱼BOT所使用的插件，当框架出现未捕获的异常时会给配置的好友或Q群发送消息**

```ts
import App from 'saltfish-bot'
import plugin from '@saltfish-bot/plugin-error-catch'

const app = new App()
app
  .plugin(plugin, {
    // 接收消息的Q号
    user_id: [1000],
    // 接收消息的Q群
    group_id: [1000]
  })
  .start()
```
