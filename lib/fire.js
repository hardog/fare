
/**
 * Module dependencies.
 */

var debug = require('debug')('fire');
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
  var self = this;

  Socket.call(self);
  self.n = 0;
  self.use_stream = opts.stream || false;
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
    this.sendLog(message);
    message = this.log_queue.pop();
  }

  this.log_queue.length = 0;
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

  if(!this.connected){
      return this.log_queue.push(msg);
  }

  if(sock){
      if(this.use_stream){
          str_stream(msg).pipe(sock);
      }else{
          sock.write(msg + '\n');
      }
  }
};