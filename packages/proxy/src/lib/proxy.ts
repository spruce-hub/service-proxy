import { cwd } from 'node:process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createServer as httpCreateServer } from 'node:http'
import { createServer as httpsCreateServer } from 'node:https'
import { createSecureContext } from 'tls'

import httpProxy from 'http-proxy'
import { createLogger, format } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import type { ServerResponse, IncomingMessage } from 'http'
import type Server from 'http-proxy'
import type { Config } from '../config'
import type { SecureContext } from 'tls'

const { combine, timestamp, label, prettyPrint } = format

const TRANSPORT_INFO = new DailyRotateFile({
  dirname: './logs/info/',
  filename: 'info-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  level: 'info',
  format: combine(timestamp(), prettyPrint()),
})

const TRANSPORT_ERROR = new DailyRotateFile({
  dirname: './logs/error/',
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  level: 'error',
  format: combine(timestamp(), prettyPrint(), label()),
})

const LOGGER = createLogger({
  transports: [TRANSPORT_INFO, TRANSPORT_ERROR],
})

const isDistribution = (
  proxy: Server<IncomingMessage, ServerResponse<IncomingMessage>>,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  config: Config
) => {
  try {
    if (req.headers.host) {
      proxy.web(req, res, {
        target: config.path[req.headers.host].proxyUrl,
      })
    }
  } catch (err) {
    res.end('系统错误，正在紧急修复')
    LOGGER.error(`${err}`, { label: '访问成功，但是找不到目标服务器' })
  }
}

const isError = (proxy: Server<IncomingMessage, ServerResponse<IncomingMessage>>) => {
  proxy.on('error', (err, req, res) => {
    const response = res as ServerResponse<IncomingMessage>
    try {
      response.writeHead(500, {
        'Content-Type': 'application/json',
      })
      LOGGER.info(`${err}`, { label: '与目标服务器连接异常' })
      response.end('服务连接异常')
    } catch {
      LOGGER.error(`${err}`, { label: `检查远程地址：${req.headers.host} 是否有误` })
    }
  })
}

export const createServer = (config: Config) => {
  const PROXY = httpProxy.createProxy({
    xfwd: true,
  })
  isError(PROXY)

  const ssl = {
    SNICallback: function (hostname: string, cb: (err: Error | null, ctx?: SecureContext) => void) {
      try {
        const ctx = createSecureContext({
          key: readFileSync(join(cwd(), `${config.sslDir}/${hostname}.key`)),
          cert: readFileSync(join(cwd(), `${config.sslDir}/${hostname}.pem`)),
        })
        cb(null, ctx.context)
      } catch (err) {
        LOGGER.error(`${err}`, { label: 'SSL 证书无效' })
      }
    },
  }
  const HTTPS = httpsCreateServer(ssl, (req, res) => {
    isDistribution(PROXY, req, res, config)
  })

  HTTPS.listen(443, '0.0.0.0', () => {
    console.log('HTTPS 正常运行 >>> https://0.0.0.0:443')
    LOGGER.info('HTTPS 正常运行 >>> https://0.0.0.0:443')
  })

  const HTTP = httpCreateServer((req, res) => {
    if (req.headers.host && config.path[req.headers.host].https) {
      res.statusCode = 302
      res.setHeader('Location', `https://${req.headers.host}${req.url}`)
      res.end()
    } else {
      isDistribution(PROXY, req, res, config)
    }
  })

  HTTP.listen(80, '0.0.0.0', () => {
    console.log('HTTP 正常运行 >>> http://0.0.0.0:80')
    LOGGER.info('HTTP 正常运行 >>> http://0.0.0.0:80')
  })
}
