# Service Proxy

> Universal http proxy utils

```js
// index.js
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
```

```bash
> node index.js

> https://npm.sprucefe.com
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2023-present, Spruce FE
