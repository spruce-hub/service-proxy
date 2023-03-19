import { cwd } from 'node:process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createServer as httpCreateServer } from 'node:http'
import { createServer as httpsCreateServer } from 'node:https'

import httpProxy from 'http-proxy'
import { createLogger, format } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import type { ServerResponse, IncomingMessage } from 'http'
import type Server from 'http-proxy'
import type { Config } from '../config'

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
        target: config.path[req.headers.host],
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
  if (config.https?.sslKey && config.https?.sslPem) {
    const FILE_PATH_KEY = join(cwd(), config.https.sslKey)
    const FILE_PATH_PEM = join(cwd(), config.https.sslPem)
    const HTTPS_OPTION = {
      key: readFileSync(FILE_PATH_KEY),
      cert: readFileSync(FILE_PATH_PEM),
    }

    const SERVER = httpsCreateServer(HTTPS_OPTION, (req, res) => {
      isDistribution(PROXY, req, res, config)
    })

    SERVER.listen(443, '0.0.0.0', () => {
      console.log('HTTPS 正常运行 >>> https://0.0.0.0:443')
      LOGGER.info('HTTPS 正常运行 >>> https://0.0.0.0:443')
    })
  }

  const SERVER = httpCreateServer((req, res) => {
    isDistribution(PROXY, req, res, config)
  })

  SERVER.listen(80, '0.0.0.0', () => {
    console.log('HTTP 正常运行 >>> http://0.0.0.0:80')
    LOGGER.info('HTTP 正常运行 >>> http://0.0.0.0:80')
  })
}
