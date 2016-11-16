# Fare

[![Build Status](https://travis-ci.org/hardog/fare.svg?branch=master)](https://travis-ci.org/hardog/fare)
[![Coverage Status](https://img.shields.io/codecov/c/github/hardog/fare.svg)](https://codecov.io/github/hardog/fare?branch=master)
[![License](https://img.shields.io/npm/l/fare.svg)](https://www.npmjs.com/package/fare)
[![npm Version](https://img.shields.io/npm/v/fare.svg)](https://www.npmjs.com/package/fare)

a simple log pkg, send log to elasticsearch

# Features

- stream support
- data loss guard against

# Options

- `host`, target host
- `port`, target port
- `stream(on|off)`, use stream pipe log


# Benchmark

enter benchmark dir, then execute `$node bunyan_vs_fare.js`

```
Fare Spend: 1811266 op/s
Bunyan Spend: 70521 op/s
```


# Install

`$ npm install fare -g`


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

[MIT](https://github.com/hardog/fare/blob/master/LICENSE)
