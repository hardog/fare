var net = require('net');
var expect = require('chai').expect;
var Fare = require('../lib/fare');

process.on('uncaughtException', (err) => {
    console.log('GLOBAL:', err);
});

describe('#fare', function(){
    var server, cb;

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
    });

    it('should work when send', function(done){
        var f = new Fare();
        cb = function(log){
            expect(/log: terminal/.test(log)).to.be.true;
            done();
        };
        f.send('log: terminal');
    });

    it('should work when use stream:on', function(done){
        var opts = {stream: 'on'};
        var f = new Fare(opts);

        var psend = f.send;
        f.send = function(msg){
            expect(this.stream).to.be.equal('on');
            f.send = psend;
            done();
        };

        f.send('use stream');
    });

    it('should work when use pipe to sock stream', function(done){
        var opts = {stream: 'on'};
        var f = new Fare(opts);

        setTimeout(function(){
            var sock = f.socks[0];
            cb = function(data){};
            sock.on('pipe', function(chunk){
                done();
            });
            f.send('use stream');
        }, 10);
    });

    it('should work when network loss connection', function(done){
        var f = new Fare();

        setTimeout(() => {
            f.connected = false;
            f.send('should queue1');
            expect(f.log_queue.length).to.be.equal(1);
            cb = function(log){
                expect(f.log_queue.length).to.be.equal(0);
                expect(/should queue1/.test(log)).to.be.true;
                done();
            };

            var sock = f.socks[0];
            sock.emit('connect');
        }, 10);
    });

    it('should emit ignore when exist err code (ECONNREFUSED)', function(done){
        var f = new Fare();

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
        var f = new Fare();

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
        var f = new Fare();

        setTimeout(function(){
            var sock = f.socks[0];
            f.closing = true;
            f.on('close', function(){
                done();
            });

            sock.emit('close');
        }, 2);
    });

    it('should retry when emit close', function(done){
        var f = new Fare();

        setTimeout(function(){
            var sock = f.socks[0];
            f.closing = false;
            f.on('reconnect attempt', function(){
                done();
            });

            sock.emit('close');
        }, 2);
    });

    it('should log queue when no sock', function(done){
        var f = new Fare();

        setTimeout(function(){
            f.socks = [];
            f.send('no sock available');
            expect(f.log_queue.length).to.be.equal(1);
            done();
        }, 2);
    });

    it('should drop msg when large than buf_size', function(done){
        var opts = {buf_size: 2};
        var f = new Fare(opts);
        f.on('drop', function(msg){
            expect(msg).to.be.equal('drop 3');
            done();
        });

        setTimeout(function(){
            f.socks = [];
            f.send('no sock 1');
            f.send('no sock 2');
            f.send('drop 3');
        }, 2);
    });

    it('should destroyed sock', function(done){
        var f = new Fare();

        setTimeout(function(){
            expect(f.socks[0].destroyed).to.be.false;
            f.close();
            expect(f.socks[0].destroyed).to.be.true;
            done();
        }, 2);
    });
});