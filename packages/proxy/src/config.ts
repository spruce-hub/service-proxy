export interface Config {
  https?: {
    /** SSL Key 相对于运行目录的根路径
     *
     * - sslKeyPath = join(cwd(), config.https.sslKey)
     * -------------------------- */
    sslKey: string

    /** SSL Pem 相对于运行目录的根路径
     *
     * -- sslPemPath = join(cwd(), config.https.sslPem)
     * -------------------------- */
    sslPem: string
  }

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
