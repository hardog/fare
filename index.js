// var Fire = require('./lib/fire');

// var f = new Fire();

// f.connect(9998, '192.168.40.36', function(){
//     console.log('connected ...');
//     f.send('new 1111: --++  hello this is fire!');
// });

var fs = require('fs');
var Fire = require('./lib/log');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998
});

var cnt = 1;
setInterval(() => {
    f.log('营销活动--xxyyzz--: 0000%d', cnt++);
}, 2000);

// var logstash = require('./example/console');
// logstash.createLogger({'level': 'info'});

// setInterval(() => {
//     console.log('营销活动2: 0000%d', cnt++);
// }, 1000);