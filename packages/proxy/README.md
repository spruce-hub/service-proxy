# Service Proxy

> Universal http proxy utils

```js
// index.js
import { createServer } from '@spruce-hub/service-proxy'

const config = {
  sslDir: './ssl'
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
