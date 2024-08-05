# 咸鱼Bot

> **客户端请使用[go-cqhttp](https://github.com/Mrs4s/go-cqhttp)或[NapCatQQ](https://github.com/NapNeko/NapCatQQ)**

### 安装方法
```sh
npm i saltfish-bot
```
or
```sh
pnmp i saltfish-bot
```

### 使用方法
推荐使用`TypeScript`开发以获得较为完整的类型提示
``` ts
// TypeScript
import App from 'saltfish-bot'

const app = new App()

app.start()

// JavaScript
const App = require('saltfish-bot').default

const app = new App()

app.start()
```

**plugins**里有一些插件，也可以看一看

### 文档
> 懒得写，看旧的将就一下吧
https://blacktunes.github.io/xianyu-robot-doc/


### 项目参考
开发中大量参考了以下项目，在此表示感谢
* [node-cq-robot](https://github.com/CaoMeiYouRen/node-cq-robot)
* [cq-websocket](https://github.com/momocow/node-cq-websocket)
