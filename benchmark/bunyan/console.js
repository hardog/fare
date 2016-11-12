'use strict';

const util = require('util');
const bunyan = require('bunyan');
const bunyanTcp = require('./logstash');

let previousRetryTime = 0;
let retryTime = 0;
let LoginTimeout = 15;

let bunyanStream = (options) => {
    return bunyanTcp.createStream({
        host: '192.168.40.36',
        port: 9998
    }).on('connect', () => {
        previousRetryTime = 0;
    }).on('close', () => { 
        retryTime = previousRetryTime + LoginTimeout * 80;
        previousRetryTime = retryTime;

        setTimeout(function() {
            CreateBunyanConsoleLog(options);
        }, retryTime);
    }).on('error', () => {
        retryTime = previousRetryTime + LoginTimeout * 80;
        previousRetryTime = retryTime;

        setTimeout(function() {
            CreateBunyanConsoleLog(options);
        }, retryTime);
    });
};

let CreateBunyanConsoleLog = (options) => {
    let bunyanLog;
    
    options = options || {};
    options.name = 'HMP-bunyan';
    options.streams = [{
        // log info and above to bunyan-logstash-tcp
        level: options.level || 'info',
        type: options.type || 'raw',
        stream: bunyanStream(options)
    }];

    exports.bunyanLog = bunyanLog = bunyan.createLogger(options);

    ['error', 'info', 'log', 'warn'].forEach(function(logType){
        console[logType] = function(){
            let message = util.format.apply(util, arguments);
            // log to logstash
            switch (logType) {
            case 'error':
                bunyanLog.error(message);
                break;
            case 'info':
                bunyanLog.info(message);
                break;
            case 'log':
                bunyanLog.info(message);
                break;
            case 'warn':
                bunyanLog.warn(message);
                break;
            }
        };

    });
    return bunyanLog;
};

let catchProcessError = (process) => {
    process.on('uncaughtException', processErrorHandler);
    process.on('unhandledRejection', processErrorHandler);
};

let processErrorHandler = function(e){
    console.error('unCatchProcessError', e && e.stack, Array.prototype.slice.call(arguments, 1));
};

module.exports.stream = bunyanStream;
module.exports.catchError = catchProcessError;
module.exports.createLogger = CreateBunyanConsoleLog;