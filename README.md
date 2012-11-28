enum.js
=======

Enum.js is a simple library that provides functional enumeration over an abstract collection of elements. The user can define its own enumerations or use the basic ones already provided.

Enum.js comes with support with common "sequenceable" items such as arrays or
lists, but it shines when creating custom enumerations. For example, an
enumeration for the Fibonacci sequence would look a bit like this:

```javascript

var fibo = new Enum(
    function next() {
        var data = this.data;
        !data.count && (data.count = 0);
        !data.cache && (data.cache = []);

        var n;
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
    }
);


for (var i = 0; i < 300; i++)
    console.log(fibo.get());
```

One of the advantages of Enum.js is that it can operate over infinite lists of items,
as long as the `next()` operation is properly defined. Obviously, the Fibonacci
enumeration above is an example of this, and that's why the `count` method returns
infinity.

Enumerations can only go forward. Taht means that most operations in the enumeration
consume the current item (that is, advance the cursor). Enumerations are entirely
functional and do not modify the original object, while trying to be as efficient
as possible.

Enum.js is inspired by OCaml's `Enum` module.

Example of usage
-------------

    var seq1 = Enum.fromString("It's just a string");

