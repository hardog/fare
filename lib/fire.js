
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
  self.queue_size = opts.queue_size || 10;
  self.log_queue = [];

  self.connect(opts.port, opts.host, function(){
    console.log('reconnected');
    self.announce();
  });
}

/**
 * Inherits from `Socket.prototype`.
 */

Fire.prototype.__proto__ = Socket.prototype;

Fire.prototype.announce = function(){
  var message = this.log_queue.pop();

  while(message){
    self.sendLog(message);
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