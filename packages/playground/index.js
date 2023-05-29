import { createServer } from '@spruce-hub/service-proxy'

const config = {
  sslDir: './ssl',
  path: {
    'npm.sprucefe.com': {
      proxyUrl: 'http://localhost:4873',
      https: true,
    },
    'ui.sprucefe.com': {
      proxyUrl: 'http://localhost:8080',
      https: true,
    },
  },
}

createServer(config)
