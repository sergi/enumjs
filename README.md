enum.js
=======

Install
-------

    npm install enumjs

Or from source:

    git clone git://github.com/sergi/enumjs.git
    cd enumjs
    npm link

What is it
----------

Enum.js provides easy representation of finite or infinite sequences of elements.

Enumerations are a uniform manner of reading and manipulating the contents
of a data structure, or as a simple manner of reading or writing sequences
of characters, numbers, strings, etc. from/to files, network connections or
other inputs/outputs.

Enumerations are typically computed as needed, which allows the definition
and manipulation of huge (possibly infinite) sequences. Manipulating an
enumeration is a uniform and often comfortable way of extracting subsequences
(For example, using `Enumjs.filter`), converting sequences into other
sequences (Using `Enumjs.map`), gathering information (function `Enumjs.scanl` et al)
or performing loops (functions Enumjs.iter and Enum.map).

The library comes with support with common "sequenceable" items such as arrays or
strings, but it shines when creating custom enumerations.

Simple examples
---------------

```javascript
    var seq = Enum.fromArray([1, 2, 3, 4, 5, 6]);
    // [1, 2, 3, 4, 5, 6]
    //  ^
    //  Cursor is at position 0

    seq.next(); // returns 1
    // [1, 2, 3, 4, 5, 6]
    //     ^
    //     Cursor is at position 1

    // Iterate over the values and print them. This will consume the whole
    // enumeration
    seq.iter(console.log);
    // [1, 2, 3, 4, 5, 6]
    //                 ^
    //                 Cursor is at position 5. The enumeration is now depleted.

    var seq2 = Enum.fromArray([1, 2, 3, 4, 5, 6]);
    var even = function(e) {
        return e % 2 === 0;
    };

    var el = seq2.find(even); // Returns 2
    // [1, 2, 3, 4, 5, 6]
    //     ^
    //     Cursor is at position 1
```

In the example below, Enumjs.randInt() creates an infinite enumeration of
random numbers. Combined with `Enum.map`, we may turn this into an
infinite enumeration of squares of random even numbers:

```javascript

Enum.randInt()
    .filter(function(e) { return e % 2 == 0 }
    .map(function(e) { return e * e })

```

Similarly, to get an enumeration of 50 random integers, we may use
Enum.take:

```javascript
Enum.take(50, Enum.randInt())
```

Defining custom enumerations
----------------------------

In order to define

One of the advantages of Enum.js is that it can operate over infinite lists of items,
as long as the `next()` operation is properly defined. Obviously, the Fibonacci
enumeration above is an example of this, and that's why the `count` method returns
infinity.

For example, an enumeration for the Fibonacci sequence would look a bit like this:

```javascript
var fibo = new Enum(
    function next() {
        var n;
        var data = this.data;

        if (data.count < 2)
            n = data.count;
        else
            n = data.cache[0] + data.cache[1];

        data.cache.push(n);
        data.cache = data.cache.slice(-2); // We only cache last 2 values
        data.count++;

        return n;
    },

    function count() { return Infinity; },

    function clone() {
        var _clone = fibo();
        _clone.data.count = this.data.count;
        _clone.data.cache = [this.cache[0], this.cache[1]];
        return clone;
    },

    // Initial extra properties for this enumeration
    { count: 0, cache: [] }
);
```

To list the first 300 Fibonacci numbers we can do:

```javascript
for (var i = 0; i < 300; i++)
    console.log(fibo.get());
```

Enumerations can only go forward. That means that most operations in the enumeration
consume the current item (that is, advance the cursor). Enumerations are entirely
functional and in case to be based on a particular object like an array, they do not
modify the original object, while trying to be as efficient as possible.

Enum.js is inspired by OCaml's `Enum` module.


Copyright 2012 Sergi Mansilla.

