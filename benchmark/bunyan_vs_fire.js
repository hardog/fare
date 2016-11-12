var exec = require('child_process').exec;

exec('node ./bunyan', function(err, stdout, stderr){
    process.stdout.write('Bunyan Spend: ' + stdout + '\n');
});

exec('node ./fire', function(err, stdout, stderr){
    process.stdout.write('Fire Spend: ' + stdout + '\n');
});
