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
    opts.terminal = opts.terminal || 'on';
    opts.host = opts.host || '127.0.0.1';
    opts.port = opts.port || 9998;

    this.timeout = opts.timeout || 1000;
    this.tag = opts.tag || process.title;
    this.level = extend(level, opts.level);
    this.attach = opts.attach || 'None';

    this.fire = new Fire(opts);
    this.out = to_terminal(opts);
    this.buf = [];
    this.timer = null;
}

Log.prototype._fire = function(){
    return this.fire;
};

Log.prototype.close = function(){
    this.fire.close();
};

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
    self.out.write(msg + '\n');
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

function extend(dest, src){
    if(!src)return dest;

    var o = dest || {};
    var keys = Object.keys(src);
    var len = keys.length;

    for(var i = 0; i < len; i++){
        o[keys[i]] = src[keys[i]];
    }

    return o;
}

function to_terminal(opts){
    return opts.terminal === 'on'
           ? process.stdout
           : {write: noop};
}

function noop(){}
