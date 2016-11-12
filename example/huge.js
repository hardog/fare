var fs = require('fs');
var Fire = require('../lib/log');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998,
    tag: 'Huge-Stream',
    timeout: 10,
    stream: 'on', 
    terminal: 'off' // this is default
});

// local tested show: when file large then 50mb or larger stream is better
var str = fs.readFileSync('./huge.txt');
var st = +new Date();
f.log('HUGE STRING ARTICLE NONON:', str.toString());
setTimeout(function(){
    var inst = f._fire();
    var sock = inst.socks[0];
    sock.on('end', function(){
        console.log('spend:', +new Date() - st, 'ms');
    });
}, 100);