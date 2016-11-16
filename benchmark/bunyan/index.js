var logstash = require('./console');
logstash.createLogger({'level': 'info'});

var ops = 10000000;
var st = +new Date();
for(var i = 0; i < ops; i++){
    console.log(i);
}

var time = +new Date() - st;
var ops_ps = parseInt((1000/time) * ops);
process.stdout.write(ops_ps + ' op/s');
process.exit(0);