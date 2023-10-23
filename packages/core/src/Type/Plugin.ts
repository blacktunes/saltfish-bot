
interface PluginDefaultConfig {
  /** 是否加载插件 */
  enabled?: boolean
  /** 是否自动保存修改的配置 */
  auto_save?: boolean
  whitelist?: {
    group?: number[]
    user?: number[]
  }
  blacklist?: {
    group?: number[]
    user?: number[]
  }
}

/** 插件设置 */
export type PluginConfig<T extends { [key: string]: any } = {}> = PluginDefaultConfig & T
