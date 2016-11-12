var Fire = require('../lib/log');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998,
    tag: 'Basic',
    terminal: 'on' // this is default
});

f.log('hello, this is log');
f.warn('hello, this is warn');
f.error('hello, this is error');