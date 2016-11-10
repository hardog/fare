var Fire = require('./lib/fire');

var f = new Fire();

f.connect(9998, '192.168.40.36', function(){
    console.log('connected ...');
    f.send('hello this is fire!');
});
