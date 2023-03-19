import { createServer } from '@spruce-hub/service-proxy'

const config = {
  https: {
    sslKel: './ssl/npm.sprucefe.com.key',
    sslPem: './ssl/npm.sprucefe.com.pem',
  },
  path: {
    'npm.sprucefe.com': 'http://localhost:4873',
  },
}

createServer(config)
