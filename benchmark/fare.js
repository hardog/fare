var Fire = require('../lib/fare');
var f = new Fire({
    host: '192.168.40.36',
    port: 9998
});

var ops = 100;
setTimeout(() => {
    function more(){
        for(var i = 0; i < ops; i++){
            f.send(`fire-newxx:[${i}]`);
        }

        setImmediate(more);
    }

    more();
}, 100);
