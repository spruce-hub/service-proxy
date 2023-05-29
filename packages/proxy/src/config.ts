export interface Config {
  /** 存放 SSL 证书的目录的相对路径
   *
   * SSL 证书命名格式：
   *  - 域名.key
   *  - 域名.pem
   * -------------------------- */
  sslDir: string

  /** 远程地址和目标地址
   * - 远程地址不要带协议
   * - `proxyUrl` 目标地址
   * - `https` 是否启用 https，若启用，当访问 http 时会自动重定向到 https
   * ```
   * {
   *   'spruce.com': {
   *      proxyUrl: 'http://0.0.0.0:3000',
   *      https: true,
   *    },
   *   'npm.spruce.com': {
   *      proxyUrl: 'http://0.0.0.0:4000',
   *      https: false,
   *    },
   * }
   * ```
   * -------------------------- */
  path: Record<string, { proxyUrl: string; https: boolean }>
}
