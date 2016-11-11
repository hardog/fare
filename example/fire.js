var fs = require('fs');
var Fire = require('../lib/log');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998,
    terminal: 'off'
});

// var cnt = 1;
// setInterval(() => {
//     f.log('营销活动--xxyyzz--: 0000%d', cnt++);
// }, 2000);


var st = +new Date();
for(var i = 0; i < 100000; i++){
    f.log(i);
}
process.stdout.write((+new Date() - st) + 'ms');
process.exit(0);