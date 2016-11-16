var combined = require('./combined');
var Fire = require('../lib/fare');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998,
    use_stream: true
});

f.send('hello, this is combine!');
