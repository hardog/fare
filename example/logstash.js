'use strict';

const bunyan = require('bunyan');
const net = require('net');
const os = require('os');
const CBuffer = require('CBuffer');
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const Stream = require('stream');
const _ = require('underscore');

let levels = {
    30: 'info',
    40: 'warn',
    50: 'error'
};

function createLogstashStream(options){
    return new LogstashStream(options);
}

function LogstashStream(options){
    EventEmitter.call(this);
    options = options || {};

    this.name        = 'HMP-bunyan';
    this.level       = 'info';
    this.server      = os.hostname();
    this.host        = options.host || '127.0.0.1';
    this.port        = options.port || 9999;
    this.application = process.title;
    this.type        = options.type;

    this.client = null;
    this.cbuffer_size        = options.cbuffer_size || 10;

    // Connection state
    this.log_queue = new CBuffer(this.cbuffer_size);
    this.connected = false;
    this.socket = null;
    this.retries = -1;

    this.max_connect_retries = ('number' === typeof options.max_connect_retries) ? options.max_connect_retries : 4;
    this.retry_interval = options.retry_interval || 100;

    this.connect();
}

util.inherits(LogstashStream, Stream);

LogstashStream.prototype.write = function logstashWrite(entry){
    var level, rec, msg, src, apps;

    if (typeof(entry) === 'string'){
      try{
        entry = JSON.parse(entry);
      }catch(e){
        entry = {
          level: 30,
          msg: entry
        };
      }
    }

    src = this.application;
    apps = src.split('/');

    if(apps.length > 3){
      src = `${apps[apps.length-3]}/${apps[apps.length-2]}/${apps[apps.length-1]}`;
    }

    rec = _.clone(entry);
    level = rec.level;

    if (levels.hasOwnProperty(level)){
        level = levels[level];
    }

    msg = {
        'msg':   rec.msg,
        'src':   src,
        'level': level
    };

    if (typeof(this.type) === 'string'){
        msg.type = this.type;
    }

    delete rec.time;
    delete rec.msg;

    // Remove internal bunyan fields that won't mean anything outside of
    // a bunyan context.
    delete rec.v;
    delete rec.level;

    rec.pid = this.pid;

    //this.send(JSON.stringify(_.extend({}, msg, rec), bunyan.safeCycles()));
    this.send(JSON.stringify(msg, bunyan.safeCycles()));
};

LogstashStream.prototype.connect = function logstashConnect(){
  this.retries++;
  this.connecting = true;
  this.socket = new net.Socket();
  var self = this;
  
  this.socket.connect({port: self.port, host: self.host}, function () {
    self.announce();
    self.connecting = false;
  });  

  this.socket.unref();
  this.socket.on('error', function (e) {
    self.connecting = false;
    self.connected = false;
    self.socket.destroy();
    self.socket = null;
    console.error(`${e.message}\n${e.stack}`);
  });

  this.socket.on('timeout', function() {
    if (self.socket.readyState !== 'open') {
      self.socket.destroy();
      self.emit('timeout');
    }
  });

  this.socket.on('connect', function () {
    self.retries = 0;
    self.emit('connect');
  });

  this.socket.on('close', function () {
    self.connected = false;
    
    if (self.max_connect_retries < 0 || self.retries < self.max_connect_retries) {
      if (!self.connecting) {
        setTimeout(function () {
          self.connect();
        }, self.retry_interval).unref();
      }
    } else {
      self.log_queue = new CBuffer(self.cbuffer_size);
      self.silent = true;
      self.emit('close');
    }

  });
  
};

LogstashStream.prototype.announce = function logstashAnnounce(){
  var self = this;
  self.connected = true;
  self.flush();
};

LogstashStream.prototype.flush = function logstashFlush(){
  var self = this;

  var message = self.log_queue.pop();
  while(message){
    self.sendLog(message.message);
    message = self.log_queue.pop();
  }

  self.log_queue.empty();
};

LogstashStream.prototype.sendLog = function logstashSendLog(message){
  this.socket.write(message + '\n');
};

LogstashStream.prototype.send = function logstashSend(message){
  var self = this;

  self.sendLog(message);
};

module.exports = {
  createStream:   createLogstashStream,
  LogstashStream: LogstashStream
};
