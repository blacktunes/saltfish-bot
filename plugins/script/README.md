# @saltfish-bot/plugin-script

**咸鱼BOT所使用的插件，可以通过消息让框架执行JavaScript代码**

> 需要先配置管理员

```ts
import App from 'saltfish-bot'
import plugin from '@saltfish-bot/plugin-script'

const app = new App()
app
  .plugin(plugin)
  .start()
```

**示例**
```
#script
console.log(1)
```