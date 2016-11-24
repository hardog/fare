
/**
 * Module dependencies.
 */

var debug = require('debug')('fare:main');
var str_stream = require('string-to-stream');
var Socket = require('./sock');

/**
 * Expose `RepSocket`.
 */

module.exports = Fire;

/**
 * Initialize a new `RepSocket`.
 *
 * @api private
 */

function Fire(opts) {
  opts = opts || {};
  opts.host = opts.host || '0.0.0.0';
  opts.port = opts.port || 9998;

  var self = this;
  Socket.call(self);
  self.n = 0;
  self.buf_size = opts.buf_size || 100;
  self.stream = opts.stream || 'off';
  self.log_queue = [];

  self.connect(opts.port, opts.host, function(){
    debug('connected host %s port %s', opts.host, opts.port);
    self.announce();
  });
}

/**
 * Inherits from `Socket.prototype`.
 */

Fire.prototype.__proto__ = Socket.prototype;

Fire.prototype.announce = function(){
  debug('announce, queue size %d', this.log_queue.length);
  var message = this.log_queue.pop();

  while(message){
    this.send(message);
    message = this.log_queue.pop();
  }

  this.log_queue.length = 0;
  debug('flushed queue msg');
  this.emit('flush');
};

/**
 * Sends `msg` to the remote peers. Appends
 * the null message part prior to sending.
 *
 * @param {Mixed} msg
 * @api public
 */
Fire.prototype.send = function(msg){
  debug('send msg, size %d', msg.length);
  var socks = this.socks;
  var len = socks.length;
  var sock = socks[this.n++ % len];
  var q_len = this.log_queue.length + 1;
  var should_drop = (q_len > this.buf_size ? true : false);

  if(!this.connected || !sock){
      debug('queue or drop msg, len: %d', q_len);
      return should_drop
             ? this.emit('drop', msg)
             : this.log_queue.push(msg);
  }

  if(this.stream === 'on'){
      str_stream(msg).pipe(sock);
  }else{
      sock.write(msg + '\n');
  }
};