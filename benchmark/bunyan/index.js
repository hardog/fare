var logstash = require('./console');
logstash.createLogger({'level': 'info'});

var ops = 1000;
setTimeout(() => {
    function more(){
        for(var i = 0; i < ops; i++){
            console.log('b' + i);
        }

        setImmediate(more);
    }

    more();
}, 100);