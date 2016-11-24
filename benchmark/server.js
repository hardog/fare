var net = require('net');
var cnt = 0;

var n = 0;
var ops = 20000;
var prev = undefined;
var r;

server = net.createServer(function(sock){
    sock.on('data', function(chunk){
        if(!prev){
            prev = Date.now();
        }

        if(++n % ops == 0){
            var ms = Date.now() - prev;
            var s = ms / 1000;
            var persec = parseInt(ops / s || 0);
            if(!r) r = persec;
            else if(r < persec) r = persec;
            console.log(persec + ' op/s');
            console.log(new Date() + ', total:' + ops + 'ops in ' + s + 's!');
            var mc = process.memoryUsage();
            console.log(mc.rss, mc.heapTotal, mc.heapUsed);
            prev = undefined;
        }
    });
});

server.listen(9998);

function done(){
    console.log('max is:', r, ' ops/s');
    process.exit(0);
}

process.on('SIGINT', done);