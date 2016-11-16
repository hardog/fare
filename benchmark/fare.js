var Fire = require('../lib/fare');
var f = new Fire({
    host: '0.0.0.0',
    port: 9998
});

var ops = 1000;
setTimeout(() => {
    function more(){
        for(var i = 0; i < ops; i++){
            f.send('f' + i);
        }

        setImmediate(more);
    }

    more();
}, 100);
