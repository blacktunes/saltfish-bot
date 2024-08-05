# @saltfish-bot/plugin-system

**咸鱼BOT所使用的插件，可以获取运行咸鱼BOT的设备状态和BOT的状态以及指令说明**

```ts
import App from 'saltfish-bot'
import Sys from '@saltfish-bot/plugin-system'

const app = new App()
app
  .plugin(Sys)
  .start()
```

### 指令
- 查看服务器状态
  - #sys
  - #服务器状态
- 查看BOT状态
  - #bot
  - #BOT状态
- 查看所有可用指令
  - #help