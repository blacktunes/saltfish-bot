import { Message, NodeMessage } from '../Type'
import { encode } from './Tools'

/**
 * CQ码
 */
export class CQCODE {
  /**
   * QQ表情
   * @param id 表情id https://github.com/kyubotics/coolq-http-api/wiki/表情-CQ-码-ID-表
   */
  face(id: number): string {
    return `[CQ:face,file=${id}]`
  }

  /**
   * 图片
   * @param file 图片文件名或URL
   */
  image(
    file: string,
    config: {
      /** 自定义显示的文件名 */
      summary?: string
      /** 只在通过网络 URL 发送时有效，表示是否使用已缓存的文件，默认 1 */
      cache?: 0 | 1
      /** 只在通过网络 URL 发送时有效，表示是否通过代理下载文件（需通过环境变量或配置文件配置代理），默认 1 */
      proxy?: 0 | 1
      /** 只在通过网络 URL 发送时有效，单位秒，表示下载网络文件的超时时间，默认不超时 */
      timeout?: number
    } = {}
  ): string {
    let _config = ''
    if (config.summary !== undefined) _config += `,summary=${encode(`[${config.summary}]`)}`
    if (config.cache !== undefined) _config += `,cache=${config.cache}`
    if (config.proxy !== undefined) _config += `,proxy=${config.proxy}`
    if (config.timeout !== undefined) _config += `,timeout=${config.timeout}`
    return `[CQ:image,file=${encode(file)}${_config}]`
  }

  /**
   * 语音
   * @param file 语音文件名
   */
  record(
    file: string,
    config: {
      /** 发送时可选，默认 0，设置为 1 表示变声 */
      magic?: 0 | 1
      /** 只在通过网络 URL 发送时有效，表示是否使用已缓存的文件，默认 1 */
      cache?: 0 | 1
      /** 只在通过网络 URL 发送时有效，表示是否通过代理下载文件（需通过环境变量或配置文件配置代理），默认 1 */
      proxy?: 0 | 1
      /** 只在通过网络 URL 发送时有效，单位秒，表示下载网络文件的超时时间，默认不超时 */
      timeout?: number
    } = {}
  ): string {
    let _config = ''
    if (config.magic !== undefined) _config += `,magic=${encode(`[${config.magic}]`)}`
    if (config.cache !== undefined) _config += `,cache=${config.cache}`
    if (config.proxy !== undefined) _config += `,proxy=${config.proxy}`
    if (config.timeout !== undefined) _config += `,timeout=${config.timeout}`
    return `[CQ:record,file=${encode(file)}${_config}]`
  }

  /**
   * 短视频
   * @param file 视频地址, 支持http和file发送
   */
  video(
    file: string,
    config: {
      /** 只在通过网络 URL 发送时有效，表示是否使用已缓存的文件，默认 1 */
      cache?: 0 | 1
      /** 只在通过网络 URL 发送时有效，表示是否通过代理下载文件（需通过环境变量或配置文件配置代理），默认 1 */
      proxy?: 0 | 1
      /** 只在通过网络 URL 发送时有效，单位秒，表示下载网络文件的超时时间，默认不超时 */
      timeout?: number
    } = {}
  ): string {
    let _config = ''
    if (config.cache !== undefined) _config += `,cache=${config.cache}`
    if (config.proxy !== undefined) _config += `,proxy=${config.proxy}`
    if (config.timeout !== undefined) _config += `,timeout=${config.timeout}`
    return `[CQ:video,file=${encode(file)}${_config}]`
  }

  /**
   * @某人(at)
   * @param id -1 为全体
   * @param isNoSpace 默认为假 At后添加空格，可使At更规范美观。如果不需要添加空格，请置本参数为true
   */
  at(id: number, isNoSpace: boolean = false): string {
    return `[CQ:at,qq=${id === -1 ? 'all' : id}]${isNoSpace ? '' : ' '}`
  }

  /**
   * 猜拳魔法表情
   */
  rps() {
    return '[CQ:rps]'
  }

  /**
   * 掷骰子魔法表情
   */
  dice() {
    return '[CQ:dice]'
  }

  // /**
  //  * 戳一戳(仅群聊)
  //  * @param qq 需要戳的成员
  //  */
  // poke(qq: number): string {
  //   return `[CQ:poke,qq=${qq}]`
  // }

  // /**
  //  * 链接分享
  //  * @param url 分享的链接
  //  * @param title 分享的标题
  //  * @param content 分享的简介
  //  * @param image 分享的图片链接
  //  */
  // share(
  //   url: string,
  //   config: {
  //     title?: string
  //     content?: string
  //     image?: string
  //   } = {}
  // ): string {
  //   let _config = ''
  //   if (config.title !== undefined) _config += `,title=${decode(config.title)}`
  //   if (config.content !== undefined) _config += `,content=${decode(config.content)}`
  //   if (config.image !== undefined) _config += `,image=${decode(config.image)}`
  //   return `[CQ:share,url=${encode(url)}${_config}]`
  // }

  // contact(type: 'qq' | 'group', id: number) {
  //   return `[CQ:contact,type=${type},id=${id}]`
  // }

  // location(lat: number, lon: number, title?: string, content?: string) {
  //   let _config = ''
  //   if (title !== undefined) _config += decode(title)
  //   if (content !== undefined) _config += decode(content)
  //   return `[CQ:location,lat=${lat},lon=${lat}${_config}]`
  // }

  /**
   * 音乐分享
   * QQ音乐传ID发送无须配置 其余需要配置签名服务器
   * @param type 分别表示使用 QQ 音乐、网易云音乐、虾米音乐
   * @param id 歌曲 ID
   */
  music(type: 'qq' | '163' | 'qq', id: number): string {
    return `[CQ:music,id=${id},type=${type}]`
  }

  /**
   * 回复
   * @param id 回复时所引用的消息id, 必须为本群消息.
   */
  reply(id: number): string {
    return `[CQ:reply,id=${id}]`
  }

  /**
   * 合并转发
   * @param id 合并转发ID, 需要通过 /get_forward_msg API获取转发的具体内容
   */
  forward(id: number): string {
    return `[CQ:forward,id=${id}]`
  }

  /**
   * 合并转发消息节点
   * 需要使用单独的API /send_group_forward_msg 发送
   * @param id 转发消息id
   */
  node(id: number): NodeMessage {
    return {
      type: 'node',
      data: {
        id: id.toString()
      }
    }
  }

  /**
   * 自定义合并转发消息节点
   * 需要使用单独的API /send_group_forward_msg 发送
   * @param name 发送者显示名字
   * @param uin 发送者QQ号
   * @param content 具体消息
   */
  customNode(name: string, uin: number, content: Message | NodeMessage[]): NodeMessage {
    return {
      type: 'node',
      data: {
        name,
        uin: uin.toString(),
        content
      }
    }
  }

  // /**
  //  * 发送xml卡片
  //  * @param data xml内容，xml中的value部分，记得实体化处理
  //  */
  // xml(data: string): string {
  //   return `[CQ:xml,data=${encode(data)}]`
  // }

  /**
   * 发送json卡片
   * @param data json内容，json的所有字符串记得实体化处理
   */
  json(data: string): string {
    return `[CQ:json,data=${encode(data)}]`
  }
}

export const CQCode = new CQCODE()
