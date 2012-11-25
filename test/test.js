var assert = require('assert');
var libpath = process.env['VFS_FTP_COV'] ? '../lib-cov' : '../lib';
var Enum = require(libpath + "/enum.js");

describe('Enum', function() {
    describe("when creating an Enum", function() {
        var topic;

        beforeEach(function() {
            topic = Enum.fromArray([1, 2, 3, 4, 5, 6]);
        });

        it("should properly tell if an Enum is empty or not", function() {
            var e = Enum.fromArray([]);
            assert.ok(e.isEmpty())
            e = Enum.fromArray([1]);
            assert.ok(e.isEmpty() === false)
        })

        it("should get all the individual items in the array", function() {
            assert.equal(topic.get(), 1);
            assert.equal(topic.get(), 2);
            assert.equal(topic.get(), 3);
            assert.equal(topic.get(), 4);
            assert.equal(topic.get(), 5);
            assert.equal(topic.get(), 6);
        })

        it("we go through all the items", function() {
            assert.equal(topic.count(), 6);

            var _counter = 0;
            topic.iter(function(item) {
                _counter++;
            });

            assert.equal(_counter, 6);
            assert.equal(topic.count(), 0);
        })

        it("cloning works nicely", function() {
            topic.get();

            var topic2 = topic.clone();
            assert.equal(topic2.count(), 5);
            topic.get();
            assert.equal(topic.count(), 4);

            var _counter = 0;
            topic2.iter(function(item) {
                _counter++;
            });

            assert.equal(_counter, 5);
            assert.equal(topic2.count(), 0);
        })

        it("adds items properly", function() {
            topic.push(23);

            assert.equal(topic.count(), 7);
            assert.equal(topic.next(), 23);
        })

    })

    describe("when finding an element", function() {
        var topic;

        beforeEach(function() {
            var t = Enum.fromArray([1, 2, 3, 4, 5, 6]);
            var el = t.find(function(e) {
                return e === 4;
            });

            topic = [el, t];
        });

        it("test that we actually find the element", function() {
            assert.equal(topic[0], 4);
        });
    }),

    describe("when not finding an element", function() {
        var topic;

        beforeEach(function() {
            var t = Enum.fromArray([1, 2, 3, 4, 5, 6]);
            var el = t.find(function(e) {
                return e === 10;
            });

            topic = [el, t];
        });

        it("test that we actually can't find the element", function() {
            assert.strictEqual(topic[0], null);
        });


        it("test that we can't find another element", function() {
            var t = topic[1];

            assert.equal(null, t.find(function(e) {
                return e === 3;
            }));
        });
    });

    describe("when peeking for the next element", function() {
        var topic;
        beforeEach(function() {
            topic = Enum.fromArray([1, 2, 3, 4, 5, 6]);
        });

        it("test that we get a null when peeking on empty Enum", function() {
            var p = Enum.fromArray([]).peek();
            assert.strictEqual(p, null);
        });

        it("test that peek gives us the proper number", function() {
            var p = topic.peek();
            p = topic.peek();
            p = topic.peek();
            p = topic.peek();
            assert.equal(p, 1);
        });
    });

    describe("when getting the next element", function() {
        var topic;
        beforeEach(function() {
            topic = Enum.fromArray([1, 2, 3, 4, 5, 6]);
        });

        it("test that we get a null when getting on empty Enum", function() {
            var p = Enum.fromArray([]).get();
            assert.strictEqual(p, null);
        });

        it("test that get gives us the proper number", function() {
            var p = topic.get();
            assert.equal(p, 1);
            p = topic.get();
            assert.equal(p, 2);
            p = topic.get();
            assert.equal(p, 3);
            p = topic.get();
            assert.equal(p, 4);
        });
    });

    describe("when mapping functions on Enums", function() {
        var topic;
        beforeEach(function() {
            topic = Enum.fromArray([1, 2, 3, 4, 5, 6]);
        });

        it("test that mapping a function gives coherent results", function() {
            var map = topic.map(function(val) {
                return val + 10;
            });
            assert.equal(map.get(), 11);
            assert.equal(map.get(), 12);

            assert.equal(topic.get(), 3);

            var mapClone = map.clone();
            assert.equal(mapClone.get(), 14);
            assert.equal(map.get(), 14);
        });
    });
});


