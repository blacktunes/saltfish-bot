import { magenta, white, yellow } from 'colors'
import { BotPlugin, GroupMsg, Message, Prevent, PrivateMsg } from '../..'
import { Bot } from '../Bot'
import NamedRegExp = require('named-regexp-groups')

export class Command {
  constructor(Bot: Bot) {
    this.Bot = Bot
  }
  private Bot: Omit<Bot, 'Command'>
  /** 命令列表 */
  list: Comm[] = []

  /** 增加命令 */
  command(name: string) {
    const repeat = this.list.some((item) => {
      return item.comm.includes(name)
    })
    if (repeat) {
      this.Bot.Log.logWarning(`发现重复指令 ${white(name)}, 指令设置失败`, '指令')
    }

    const comm = new Comm(name)
    this.list.push(comm)

    setCommLister(this.Bot as Bot, comm)

    this.Bot.Log.logNotice(
      `${comm.group ? `${yellow(comm.group)} - ` : ''}${yellow(name)} 已加载`,
      '指令'
    )

    return new SetComm(this.Bot as Bot, comm, repeat)
  }
}

export class Comm {
  constructor(name: string) {
    this.comm.push(name)
  }
  comm: string[] = []
  reg: RegExp | NamedRegExp
  admin: boolean = false
  desc: string = ''
  group: string
  fn: {
    group: ((e: GroupMsg) => Prevent)[]
    private: ((e: PrivateMsg) => Prevent)[]
  } = {
    group: [],
    private: []
  }
  whitelist: {
    group?: Set<number>
    user?: Set<number>
  } = {}
  blacklist: {
    group?: Set<number>
    user?: Set<number>
  } = {}
}

export class SetComm {
  constructor(Bot: Bot, comm: Comm, repeat: boolean) {
    this.Bot = Bot
    this.comm = comm
    this.repeat = repeat
  }
  private Bot: Bot
  private comm: Comm
  private repeat: boolean

  /** 增加指令别名 */
  alias(name: string) {
    const repeat = this.Bot.Command.list.some((item) => {
      return item.comm.includes(name)
    })
    if (repeat) {
      this.Bot.Log.logWarning(`别名与其它指令重复 ${white(name)}, 别名设置失败`, '指令')
    } else {
      this.comm.comm.push(name)
    }
    return this
  }
  /** 增加命令描述，重复调用会被覆盖 */
  desc(text: string) {
    this.comm.desc = text
    return this
  }
  /** 增加正则规则，调用后命令名将会失效 */
  reg(reg: RegExp | NamedRegExp) {
    if (this.repeat) return this
    this.comm.reg = reg
    return this
  }
  /** 是否为管理员指令 */
  admin(flag = true) {
    this.comm.admin = flag
    return this
  }
  /** 设置命令分类 */
  group(name: string) {
    this.comm.group = name
    return this
  }
  /** 增加命令处理方法，可添加多个 */
  action(type: 'private', fn: (e: PrivateMsg) => Prevent): this
  action(type: 'group', fn: (e: GroupMsg) => Prevent): this
  action(type: 'group' | 'private', fn: (e: any) => Prevent) {
    if (this.repeat) return this
    if (type === 'group') {
      this.comm.fn.group.push(fn)
    } else if (type === 'private') {
      this.comm.fn.private.push(fn)
    }
    return this
  }
  /**
   * 增加白名单列表
   * @param group_list 群聊白名单
   * @param user_list 私聊白名单
   */
  white(group_list?: number[], user_list?: number[]) {
    if (this.repeat) return this

    if (group_list) {
      const list = group_list.toString()
      const commName = this.comm.comm[0]
      if (this.comm.blacklist.group) {
        this.Bot.Log.logWarning(
          `${this.comm.group ? `${magenta(this.comm.group)} - ` : ''}${magenta(
            commName
          )} 已设置群聊黑名单，该白名单 ${magenta(list)} 设置无效`,
          '指令'
        )
      } else {
        this.Bot.Log.logInfo(
          `${this.comm.group ? `${this.comm.group} - ` : ''}${commName} 白名单已添加 ${list}`,
          '指令'
        )
        if (this.comm.whitelist.group) {
          group_list.forEach((group_id) => {
            this.comm.whitelist.group.add(group_id)
          })
        } else {
          this.comm.whitelist.group = new Set<number>(group_list)
        }
      }
    }

    if (user_list) {
      const list = user_list.toString()
      const commName = this.comm.comm[0]
      if (this.comm.blacklist.user) {
        this.Bot.Log.logWarning(
          `${this.comm.group ? `${magenta(this.comm.group)} - ` : ''}${magenta(
            commName
          )} 已设置私聊黑名单，该白名单 ${magenta(list)} 设置无效`,
          '指令'
        )
      } else {
        this.Bot.Log.logInfo(
          `${this.comm.group ? `${this.comm.group} - ` : ''}${commName} 白名单已添加 ${list}`,
          '指令'
        )
        if (this.comm.whitelist.user) {
          user_list.forEach((group_id) => {
            this.comm.whitelist.user.add(group_id)
          })
        } else {
          this.comm.whitelist.user = new Set<number>(user_list)
        }
      }
    }

    return this
  }
  /**
   * 增加黑名单列表
   * @param group_list 群聊黑名单
   * @param user_list 私聊黑名单
   */
  black(group_list?: number[], user_list?: number[]) {
    if (this.repeat) return this

    if (group_list) {
      const commName = this.comm.comm[0]
      const list = group_list.toString()
      if (this.comm.whitelist.group) {
        this.Bot.Log.logWarning(
          `${this.comm.group ? `${magenta(this.comm.group)} - ` : ''}${magenta(
            commName
          )} 已设置群聊白名单，该黑名单 ${magenta(list)} 设置无效`,
          '指令'
        )
      } else {
        this.Bot.Log.logInfo(
          `${this.comm.group ? `${this.comm.group} - ` : ''}${commName} 黑名单已添加 ${list}`,
          '指令'
        )
        if (this.comm.blacklist.group) {
          group_list.forEach((group_id) => {
            this.comm.blacklist.group.add(group_id)
          })
        } else {
          this.comm.blacklist.group = new Set<number>(group_list)
        }
      }
    }

    if (user_list) {
      const commName = this.comm.comm[0]
      const list = user_list.toString()
      if (this.comm.whitelist.user) {
        this.Bot.Log.logWarning(
          `${this.comm.group ? `${magenta(this.comm.group)} - ` : ''}${magenta(
            commName
          )} 已设置私聊白名单，该黑名单 ${magenta(list)} 设置无效`,
          '指令'
        )
      } else {
        this.Bot.Log.logInfo(
          `${this.comm.group ? `${this.comm.group} - ` : ''}${commName} 黑名单已添加 ${list}`,
          '指令'
        )
        if (this.comm.blacklist.user) {
          user_list.forEach((group_id) => {
            this.comm.blacklist.user.add(group_id)
          })
        } else {
          this.comm.blacklist.user = new Set<number>(user_list)
        }
      }
    }

    return this
  }
}

export const setCommLister = (Bot: Bot, comm: Comm) => {
  Bot.Event.command('message.group', async (e) => {
    if (comm.fn.group.length < 1) return
    if (comm.admin && !Bot.Admin.isAdmin(e.sender.user_id)) return
    if (comm.group) {
      const plugin = Bot.Plugin.getPlugin<BotPlugin>(comm.group)
      const blacklist = plugin?.blacklist || {}
      const whitelist = plugin?.whitelist || {}

      if (blacklist.group && blacklist.group.has(e.group_id)) return
      if (whitelist.group && !whitelist.group.has(e.group_id)) return
      if (blacklist.user && blacklist.user.has(e.user_id)) return
      if (whitelist.user && !whitelist.user.has(e.user_id)) return
    }
    if (comm.blacklist.group && comm.blacklist.group.has(e.group_id)) return
    if (comm.whitelist.group && !comm.whitelist.group.has(e.group_id)) return
    if (comm.blacklist.user && comm.blacklist.user.has(e.user_id)) return
    if (comm.whitelist.user && !comm.whitelist.user.has(e.user_id)) return
    if (comm.reg && !comm.reg.test(e.message)) return
    if (!comm.reg && !comm.comm.includes(e.message)) return

    const groupName = white(Bot.Data.groupList[e.group_id] || '')
    const groupId = white(e.group_id.toString())
    const username = white(e.sender.card || e.sender.nickname)
    const userId = white(e.user_id.toString())
    const commName = yellow(comm.comm[0])
    Bot.Log.logNotice(
      `群${groupName}(${groupId}) - ${username}(${userId})触发${commName}指令`,
      '指令'
    )
    e.reply = (msg: Message) => Bot.Api.sendGroupMsg(e.group_id, msg)
    for (const i in comm.fn.group) {
      if (await comm.fn.group[i](e)) return true
    }
  })
  Bot.Event.command('message.private', async (e) => {
    if (comm.fn.private.length < 1) return
    if (comm.admin && !Bot.Admin.isAdmin(e.sender.user_id)) return
    if (comm.group) {
      const plugin = Bot.Plugin.getPlugin<BotPlugin>(comm.group)
      const blacklist = plugin?.blacklist || {}
      const whitelist = plugin?.whitelist || {}

      if (blacklist.user && blacklist.user.has(e.user_id)) return
      if (whitelist.user && !whitelist.user.has(e.user_id)) return
    }
    if (comm.blacklist.user && comm.blacklist.user.has(e.user_id)) return
    if (comm.whitelist.user && !comm.whitelist.user.has(e.user_id)) return
    if (comm.reg && !comm.reg.test(e.message)) return
    if (!comm.reg && !comm.comm.includes(e.message)) return

    const username = white(e.sender.nickname)
    const userId = white(e.user_id.toString())
    const commName = yellow(comm.comm[0])
    Bot.Log.logNotice(`${username}(${userId})触发${commName}指令`, '指令')

    e.reply = (msg: Message) => Bot.Api.sendPrivateMsg(e.user_id, msg)
    for (const i in comm.fn.private) {
      if (await comm.fn.private[i](e)) return true
    }
  })
}
