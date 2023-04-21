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
   * ```
   * {
   *   'spruce.com': 'http://0.0.0.0:3000',
   *   'npm.spruce.com': 'http://0.0.0.0:4000',
   * }
   * ```
   * -------------------------- */
  path: {
    [key: string]: string
  }
}
