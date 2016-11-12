var net = require('net');
var expect = require('chai').expect;
var Fire = require('../lib/log');

process.on('uncaughtException', (err) => {
    console.log(err);
});

describe('#fire', function(){
    var server, f, cb;
    var opts = {
        timeout: 10
    };

    before(function(done){
        server = net.createServer(function(sock){
            sock.on('data', function(chunk){
                 cb && cb(chunk.toString());
            });
        });

        server.listen(9998, done);
    });

    after(function(){
        server && server.close();
        f && f.close();
    });

    it('should work when use log', function(done){
        f = new Fire(opts);
        cb = function(log){
            expect(/log: terminal off/.test(log)).to.be.true;
            done();
        };
        f.log('log: terminal off');
    });

    it('should work when use warn', function(done){
        f = new Fire(opts);
        cb = function(log){
            expect(/warn: terminal off/.test(log)).to.be.true;
            done();
        };
        f.warn('warn: terminal off');
    });

    it('should work when use error', function(done){
        f = new Fire(opts);
        cb = function(log){
            expect(/error: terminal off/.test(log)).to.be.true;
            done();
        };
        f.error('error: terminal off');
    });

    it('should work when use terminal:on', function(done){
        opts.terminal = 'on';
        f = new Fire(opts);
        cb = function(log){
            expect(/terminal on/.test(log)).to.be.true;
            done();
        };
        f.log('terminal on');
    });

    it('should work when use tag', function(done){
        opts.tag = 'TEST'
        f = new Fire(opts);
        cb = function(log){
            expect(/Tag:TEST/.test(log)).to.be.true;
            done();
        };
        f.log('use tag');
    });

    it('should work when use level({log: 3})', function(done){
        opts.level = {log: 3};
        f = new Fire(opts);
        cb = function(log){
            expect(/Level:3/.test(log)).to.be.true;
            done();
        };
        f.log('use level');
    });

    it('should work when use attach', function(done){
        opts.attach = 'NEW';
        f = new Fire(opts);
        cb = function(log){
            expect(/Attach:NEW/.test(log)).to.be.true;
            done();
        };
        f.log('use attach');
    });

    it('should work when use stream:on', function(done){
        opts.stream = 'on';
        f = new Fire(opts);

        var fire = f._fire();
        var psend = fire.send;
        fire.send = function(msg){
            expect(this.stream).to.be.equal('on');
            fire.send = psend;
            done();
        };

        f.log('use stream');
    });

    it('should work when network loss connection', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        var fire = f._fire();
        setTimeout(() => {
            fire.connected = false;
            f.log('should queue1');
            setTimeout(() => {
                expect(fire.log_queue.length).to.be.equal(1);
                cb = function(log){
                    expect(fire.log_queue.length).to.be.equal(0);
                    expect(/should queue1/.test(log)).to.be.true;
                    done();
                };

                var sock = fire.socks[0];
                sock.emit('connect');
            });
        }, 10);
    });

    it('should emit ignore when exist err code (ECONNREFUSED)', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        var fire = f._fire();
        setTimeout(function(){
            var sock = fire.socks[0];
            fire.on('ignored error', function(err){
                expect(err.message).to.be.equal('test');
                done();
            });

            var err = new Error('test');
            err.code = 'ECONNREFUSED';
            sock.emit('error', err);
        }, 10);
    });

    it('should emit error when not exist err code (NOT-EXIST-CODE)', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        var fire = f._fire();
        setTimeout(function(){
            var sock = fire.socks[0];
            fire.on('error', function(err){
                expect(err.message).to.be.equal('test1');
                done();
            });

            var err = new Error('test1');
            err.code = 'NOT-EXIST-CODE';
            sock.emit('error', err);
        }, 10);
    });

    it('should listen close when emit close', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        var fire = f._fire();
        setTimeout(function(){
            var sock = fire.socks[0];
            fire.closing = true;
            fire.on('close', function(){
                done();
            });

            sock.emit('close');
        }, 10);
    });

    it('should retry when emit close', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        var fire = f._fire();
        setTimeout(function(){
            var sock = fire.socks[0];
            fire.closing = false;
            fire.on('reconnect attempt', function(){
                done();
            });

            sock.emit('close');
        }, 10);
    });
});