var fs = require('fs');
var Fire = require('../lib/fare');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998,
    timeout: 10,
    stream: 'on'
});

// local tested show: when file large then 50mb or larger stream is better
var str = fs.readFileSync('./huge.txt');
var st = +new Date();
f.send('HUGE STRING ARTICLE NONON:', str.toString());
setTimeout(function(){
    var sock = f.socks[0];
    sock.on('end', function(){
        console.log('spend:', +new Date() - st, 'ms');
    });
}, 100);