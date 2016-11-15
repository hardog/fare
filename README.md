# Fire

[![Build Status](https://travis-ci.org/hardog/Fire.svg?branch=master)](https://travis-ci.org/hardog/Fire)
[![Coverage Status](https://img.shields.io/codecov/c/github/hardog/Fire.svg)](https://codecov.io/github/hardog/Fire?branch=master)
[![License](https://img.shields.io/npm/l/Fire.svg)](https://www.npmjs.com/package/Fire)
[![npm Version](https://img.shields.io/npm/v/Fire.svg)](https://www.npmjs.com/package/Fire)

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

`$ npm install Fire -g`


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

[MIT](https://github.com/hardog/Fire/blob/master/LICENSE)
