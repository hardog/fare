
/**
 * Module dependencies.
 */

var debug = require('debug')('axon:fire');
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

function Fire() {
  Socket.call(this);
  this.n = 0;
}

/**
 * Inherits from `Socket.prototype`.
 */

Fire.prototype.__proto__ = Socket.prototype;


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

  if(sock){
    console.log('sock send')
    sock.write(msg);
  }
};