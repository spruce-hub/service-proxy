import { createServer } from '@spruce-hub/service-proxy'

const config = {
  https: {
    sslKel: {
      'npm.sprucefe.com': './ssl/npm.sprucefe.com.key',
      'ui.sprucefe.com': './ssl/ui.sprucefe.com.key',
    },
    sslPem: {
      'npm.sprucefe.com': './ssl/npm.sprucefe.com.key',
      'ui.sprucefe.com': './ssl/ui.sprucefe.com.key',
    },
  },
  path: {
    'npm.sprucefe.com': 'http://localhost:4873',
    'ui.sprucefe.com': 'http://localhost:8080',
  },
}

createServer(config)
