import { createServer } from '@spruce-hub/service-proxy'

const config = {
  sslDir: './ssl',
  path: {
    'npm.sprucefe.com': 'http://localhost:4873',
    'ui.sprucefe.com': 'http://localhost:8080',
  },
}

createServer(config)
