# Firelog

[![Build Status](https://travis-ci.org/hardog/firelog.svg?branch=master)](https://travis-ci.org/hardog/firelog)
[![Coverage Status](https://img.shields.io/codecov/c/github/hardog/firelog.svg)](https://codecov.io/github/hardog/firelog?branch=master)
[![License](https://img.shields.io/npm/l/firelog.svg)](https://www.npmjs.com/package/firelog)
[![npm Version](https://img.shields.io/npm/v/firelog.svg)](https://www.npmjs.com/package/firelog)

a simple log pkg, send log to elasticsearch

# Features

- stream support
- data loss guard against
- custom log level number
- support `log、warn、error`


# Options

- `timeout(ms)`, time to flush log
- `terminal(on|off)`, terminal show
- `tag`, single log tag
- `level`, for examples `{log: 1, warn: 2, error: 3}`
- `attach`, attach extra msg to log
- `host`, target host
- `port`, target port
- `use_stream`, is use stream pipe log


# Install

`$ npm install firelog -g`


# Test

run test:
```
$ npm test
```

run test coverage:
```
$ npm run cover
```

# Examples

See [examples](./example)

# License

[MIT](https://github.com/hardog/firelog/blob/master/LICENSE)
