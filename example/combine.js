var combined = require('./combined');
var Fire = require('../lib/log');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998,
    use_stream: true,
    terminal: 'off'
});

f.log('hello, this is combine!');
