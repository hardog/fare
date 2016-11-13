# Firelog

[![Build Status](https://travis-ci.org/hardog/firelog.svg?branch=master)](https://travis-ci.org/hardog/firelog)
[![Coverage Status](https://img.shields.io/codecov/c/github/hardog/firelog.svg)](https://codecov.io/github/hardog/firelog?branch=master)
[![License](https://img.shields.io/npm/l/firelog.svg)](https://www.npmjs.com/package/firelog)
[![npm Version](https://img.shields.io/npm/v/firelog.svg)](https://www.npmjs.com/package/firelog)

a simple log pkg, send log to elasticsearch

# Features

- stream support
- data loss guard against

# Options

- `host`, target host
- `port`, target port
- `stream(on|off)`, use stream pipe log


# Benchmark

enter benchmark dir, then execute `$node bunyan_vs_fire.js`

```
Fire Spend: 847457 op/s
Bunyan Spend: 70521 op/s
```


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
