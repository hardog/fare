var util = require('util');
var Fire = require('./fire');

module.exports = Log;

var LOG = 30;
var WARN = 40;
var ERROR = 50;

var level = {
    log: LOG,
    warn: WARN,
    error: ERROR
};

function Log(opts){
    this.timeout = opts.timeout || 1000;
    this.terminal = opts.terminal || 'off';

    this.tag = opts.tag || process.title;
    this.level = opts.level || level;
    this.attach = opts.attach || 'None';

    opts.host = opts.host || '127.0.0.1';
    opts.port = opts.port || 9998;

    this.fire = new Fire(opts);
    this.buf = [];
    this.timer = null;
}

Log.prototype.push = function(type, args){
    var self = this;

    // flush function
    function flush(){
        self.timer = null;
        self.fire.send(self.buf.join('\n'));
        self.buf.length = 0;
    }

    // write function
    if(self.timer === null){
        self.timer = setTimeout(flush, self.timeout);
    }

    var msg = util.format.apply(util, args);
    msg = 'Tag:' + self.tag +
    ' Date:' + new Date() +
    ' Level:' + type +
    ' Msg:' + msg +
    ' Attach:' + self.attach;

    // is show on terminal
    to_terminal(type, msg, self);
    self.buf.push(msg);
};

Log.prototype.log = function(){
    this.push(this.level.log, arguments);
};

Log.prototype.warn = function(){
    this.push(this.level.warn, arguments);
};

Log.prototype.error = function(){
    this.push(this.level.error, arguments);
};

function to_terminal(type, msg, ctx){
    if(ctx.terminal === 'on'){
        var stream = (type === ctx.level.error ? process.stderr : process.stdout);
        stream.write(msg + '\n');
    }
}
