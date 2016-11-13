var net = require('net');
var expect = require('chai').expect;
var Fire = require('../lib/fire');

process.on('uncaughtException', (err) => {
    console.log(err);
});

describe('#fire', function(){
    var server, f, cb;
    var opts = {};

    before(function(done){
        server = net.createServer(function(sock){
            sock.on('data', function(chunk){
                 cb && cb(chunk.toString());
            });
        });

        server.listen(9998, done);
    });

    after(function(){
        f && f.close();
        server && server.close();
    });

    it('should work when send', function(done){
        f = new Fire(opts);
        cb = function(log){
            expect(/log: terminal/.test(log)).to.be.true;
            done();
        };
        f.send('log: terminal');
    });

    it('should work when use stream:on', function(done){
        opts.stream = 'on';
        f = new Fire(opts);

        var psend = f.send;
        f.send = function(msg){
            expect(this.stream).to.be.equal('on');
            f.send = psend;
            done();
        };

        f.send('use stream');
    });

    it('should work when network loss connection', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        setTimeout(() => {
            f.connected = false;
            f.send('should queue1');
            setTimeout(() => {
                expect(f.log_queue.length).to.be.equal(1);
                cb = function(log){
                    expect(f.log_queue.length).to.be.equal(0);
                    expect(/should queue1/.test(log)).to.be.true;
                    done();
                };

                var sock = f.socks[0];
                sock.emit('connect');
            });
        }, 10);
    });

    it('should emit ignore when exist err code (ECONNREFUSED)', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        setTimeout(function(){
            var sock = f.socks[0];
            f.on('ignored error', function(err){
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

        setTimeout(function(){
            var sock = f.socks[0];
            f.on('error', function(err){
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

        setTimeout(function(){
            var sock = f.socks[0];
            f.closing = true;
            f.on('close', function(){
                done();
            });

            sock.emit('close');
        }, 10);
    });

    it('should retry when emit close', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        setTimeout(function(){
            var sock = f.socks[0];
            f.closing = false;
            f.on('reconnect attempt', function(){
                done();
            });

            sock.emit('close');
        }, 10);
    });

    it('should log queue when no sock', function(done){
        opts.timeout = 1;
        f = new Fire(opts);

        setTimeout(function(){
            f.socks = [];
            f.send('no sock available');
            setTimeout(function(){
                expect(f.log_queue.length).to.be.equal(1);
                done();
            });
        }, 10);
    });

    it('should destroyed sock', function(done){
        opts.timeout = 1;
        var f = new Fire(opts);

        setTimeout(function(){
            expect(f.socks[0].destroyed).to.be.false;
            f.close();
            expect(f.socks[0].destroyed).to.be.true;
            done();
        });
    });
});