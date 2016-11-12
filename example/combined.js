var Fire = require('../lib/log');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998,
    tag: 'Combined',
    attach: 'Attach News',
    terminal: 'on' // this is default
});

f.log('hello, this is Combined! ^.^');
