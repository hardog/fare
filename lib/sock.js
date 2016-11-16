
/**
 * From TJ
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var Configurable = require('configurable');
var debug = require('debug')('fare:sock');
var net = require('net');

/**
 * Errors to ignore.
 */

var ignore = [
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENETDOWN',
  'EPIPE',
  'ENOENT'
];

/**
 * Expose `Socket`.
 */

module.exports = Socket;

/**
 * Initialize a new `Socket`.
 *
 * A "Socket" encapsulates the ability of being
 * the "client" or the "server" depending on
 * whether `connect()` or `bind()` was called.
 *
 * @api private
 */

function Socket() {
  this.socks = [];
  this.settings = {};
  this.connected = false;
  this.set('identity', String(process.pid));
  this.set('retry timeout', 100);
  this.set('retry max timeout', 5000);
}

/**
 * Inherit from `Emitter.prototype`.
 */

Socket.prototype.__proto__ = Emitter.prototype;

/**
 * Make it configurable `.set()` etc.
 */

Configurable(Socket.prototype);

/**
 * Close all open underlying sockets.
 *
 * @api private
 */

Socket.prototype.closeSockets = function(){
  debug('%s closing %d connections', this.socks.length);
  this.socks.forEach(function(sock){
    sock.destroy();
  });
};

/**
 * Close the socket.
 *
 * Delegates to the server or clients
 * based on the socket `type`.
 *
 * @param {Function} [fn]
 * @api public
 */

Socket.prototype.close = function(fn){
  debug('%s closing');
  this.closing = true;
  this.closeSockets();
};

/**
 * Remove `sock`.
 *
 * @param {Socket} sock
 * @api private
 */

Socket.prototype.removeSocket = function(sock){
  var i = this.socks.indexOf(sock);
  if (!~i) return;
  debug('%s remove socket %d', i);
  this.socks.splice(i, 1);
};

/**
 * Handle `sock` errors.
 *
 * Emits:
 *
 *  - `error` (err) when the error is not ignored
 *  - `ignored error` (err) when the error is ignored
 *  - `socket error` (err) regardless of ignoring
 *
 * @param {Socket} sock
 * @api private
 */

Socket.prototype.handleErrors = function(sock){
  var self = this;
  sock.on('error', function(err){
    debug('%s error %s', err.code || err.message);
    self.connected = false;
    self.emit('socket error', err);
    self.removeSocket(sock);
    if (!~ignore.indexOf(err.code)) return self.emit('error', err);
    debug('%s ignored %s', err.code);
    self.emit('ignored error', err);
  });
};

/**
 * Connect to `port` at `host` and invoke `fn()`.
 *
 * Defaults `host` to localhost.
 *
 * TODO: needs big cleanup
 *
 * @param {Number|String} port
 * @param {String} host
 * @param {Function} fn
 * @return {Socket}
 * @api public
 */

Socket.prototype.connect = function(port, host, fn){
  var self = this;

  var max = self.get('retry max timeout');
  var sock = new net.Socket;
  sock.setNoDelay();

  this.handleErrors(sock);

  sock.on('close', function(){
    self.emit('socket close', sock);
    self.connected = false;
    self.removeSocket(sock);
    if (self.closing) return self.emit('close');
    var retry = self.retry || self.get('retry timeout');
    setTimeout(function(){
      debug('%s attempting reconnect');
      self.emit('reconnect attempt');
      sock.destroy();
      self.connect(port, host);
      self.retry = Math.round(Math.min(max, retry * 1.5));
    }, retry);
  });

  sock.on('connect', function(){
    debug('%s connect');
    self.connected = true;
    self.socks.push(sock);
    self.retry = self.get('retry timeout');
    self.emit('connect', sock);
    fn && fn();
  });

  debug('%s connect attempt %s:%s', host, port);
  sock.connect(port, host);
  return this;
};