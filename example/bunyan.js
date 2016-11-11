var cnt = 1;

var logstash = require('./console');
logstash.createLogger({'level': 'info'});

setInterval(() => {
    console.log('营销活动2: 0000%d', cnt++);
}, 1000);

var st = +new Date();
for(var i = 0; i < 100000; i++){
    console.log(i);
}
process.stdout.write((+new Date() - st) + 'ms');
process.exit(0);