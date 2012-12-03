/**
 *  Enum
 *
 *  Enumeration over abstract collection of elements.
 *
 **/

function Enum(next, count, clone, data) {
    this.next = next.bind(this);
    this.count = count.bind(this);
    this.clone = clone.bind(this);

    this.data = {};
    var self = this;
    if (data) {
        Object.keys(data).forEach(function(prop) {
            self.data[prop] = data[prop];
        });
    }
}
module.exports = Enum;

/**
 *  Enum#iter(function)
 *
 *  `e.iter(f)` calls the function f with each element of e in turn. This
 *  consumes the enumeration.
 **/
Enum.prototype.iter = function(fn) {
    var curr;
    while ((curr = this.next()) !== null)
        fn(curr);
};

/**
 *  Enum#find(function) -> Element
 *
 *  `e.find(f)` returns the first element `x` of e such that `f(x)` returns true,
 *  consuming the enumeration up to and including the found element, or,
 *  returns null if no such element exists in the enumeration, consuming the
 *  whole enumeration in the search.
 *
 *  Since find consumes a prefix of the enumeration, it can be used several times
 *  on the same enumeration to find the next element.
 **/
Enum.prototype.find = function(fn) {
    var curr, found;
    while ((curr = this.next()) !== null) {
        if (fn(curr) === true) {
            found = curr;
            break;
        }
    }

    return found || null;
};

Enum.prototype.isEmpty = function() {
    if (this.fast)
        return this.count() === 0;
    else
        return this.peek() === null;
};

/**
 * Enum#peek() -> Element
 *
 * `peek` returns null if the enumeration is empty, or the next element if it isn't.
 * It *doesn't* advance the cursor.
 **/
Enum.prototype.peek = function() {
    var next = this.get();
    if (next !== null)
        this.push(next);

    return next;
};

/**
 * Enum#get() -> Element
 *
 * `peek` returns null if the enumeration is empty, or the next element if it isn't.
 * It advances the cursor.
 **/
Enum.prototype.get = function() {
    return this.next();
};

Enum.prototype.junk = function() {
    this.next();
};

Enum.prototype.push = function(e) {
    var make = function(self) {
        var fNext = self.next;
        var fCount = self.count;
        var fClone = self.clone;
        var nextCalled = false;

        self.next = function() {
            nextCalled = true;
            self.next = fNext;
            self.count = fCount;
            self.clone = fClone;

            return e;
        };

        self.count = function() {
            var n = fCount();
            return nextCalled === true ? n : n + 1;
        };

        self.clone = function() {
            var c = fClone();
            if (nextCalled === false)
                make(c);

            return c;
        };
    };

    make(this);
};

Enum.make = function(next, count, clone) {
    var e = new Enum();
    e.next = next;
    e.count = count;
    e.clone = clone;

    return e;
};

Enum.from = function(next) {
}

Enum.empty = function() {
    var e = new Enum();
    e.next = function() { return null; };
    e.count = function() { return 0; };
    e.clone = function() { return e.empty(); };
    e.fast = true;

    return e;
};

Enum.init = function(n, fn) {
    var e = new Enum();

    var count = n;
    e.count = function() {
        return count;
    };

    e.next = function() {
        if (count === 0) {
            throw "No more elements";
        }
        else {
            count -= 1;
            return fn(n - 1 - count);
        }
    };

    e.clone = function() {
        return e.init(count, fn);
    };

    e.fast = true;
};

Enum.prototype.map = function(fn) {
    var self = this;
    var _enum = new Enum(
        function() {
            return fn(self.next());
        },
        self.count.bind(_enum),
        function() {
            return self.clone().map(fn);
        });
    _enum.count = self.count;

    return _enum;
};

Enum.prototype.filter = function(fn) {

};

Enum.fromArray = function(array) {
    function next() {
        var value = null;
        if (typeof array[this.data.counter] !== "undefined") {
            value = array[this.data.counter];
            this.data.counter += 1;
        }

        return value;
    }

    function count() {
        return array.length - this.data.counter;
    }

    function clone() {
        var e = Enum.fromArray(array);
        e.data.counter = this.data.counter;
        return e;
    }

    var _enum = new Enum(next, count, clone);
    _enum.data.counter = 0;
    return _enum;
};

Enum.fromString = function(string) {
    return (function() {
        var counter = 0;
        this.next = function() {
            var value = string.charAt(counter);
            if (typeof value !== "undefined") {
                counter += 1;
            }

            return value;
        };

        this.count = function() {
            return string.length - counter;
        };

        this.clone = function() {
            var e = Enum.fromString(string);
            e._setCounter(counter);
            return e;
        };

        this._setCounter = function(n) {
            counter = n;
        };

        return this;
    }).call(new Enum());
};

function NoMoreElementsError() {
    this.message = "There are no elements left in the enumeration";
}

NoMoreElementsError.prototype = new Error();
NoMoreElementsError.prototype.constructor = NoMoreElementsError;

function empty() {}

function close(e) {
    e.next = function() { throw new NoMoreElementsError(); };
    e.count = function() { return 0; };
    e.clone = empty;
}
