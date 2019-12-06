# bench-js-parsers

Some benchmarks to show the performance of various JS parsers.

Specifically, I wanted to compare two features:

 * Being able to generate an AST (as a baseline test)
 * Being able to traverse the given AST recursively to perform basic static analysis

The benchmark code does not enable any helper features for the traversal in any of the
parsers such as scope computation or ancestor gathering. It assumes that these are either
not needed or can be implemented in the userland code.

## Benchmarks

These are the benchmark results on my machine, which is a MacBook Air Early 2015 with a 2.2 GHz Intel i7.
The purpose is not to take the specific numbers seriously but rather to compare the different parsers at
orders of magnitude (assuming that two parsers with results that are within the same order of magnitude
are relatively equally performant).

*Note: newlines have been added in the output to make it easier to read.*

```

> @ benchmark /Users/karimsa/projects/bench-js-parsers
> wiz bench "--benchTime" "5000000"

Targets:
        - bootstrap.min.js (md5: 61f338f870fcd0ff46362ef109d28533)
        - jquery.min.js (md5: 220afd743d9e9643852e31a135a9f3ae)
        - react.development.js (md5: 5096de8b459ac09462a481b55b4af8c0)

        parse: bootstrap.min.js (60010 bytes) - @babel/parser        57 ops/s    43.7 ms/op 
        parse: bootstrap.min.js (60010 bytes) - acorn                74 ops/s    37.5 ms/op 
        parse: bootstrap.min.js (60010 bytes) - esprima              68 ops/s    35.1 ms/op 
        parse: bootstrap.min.js (60010 bytes) - meriyah             237 ops/s    16.4 ms/op 

        parse: jquery.min.js (88145 bytes) - @babel/parser           29 ops/s    49.6 ms/op 
        parse: jquery.min.js (88145 bytes) - acorn                   37 ops/s    47.4 ms/op 
        parse: jquery.min.js (88145 bytes) - esprima                 25 ops/s      56 ms/op 
        parse: jquery.min.js (88145 bytes) - meriyah                118 ops/s    19.6 ms/op 

        parse: react.development.js (74430 bytes) - @babel/parser   119 ops/s    16.8 ms/op 
        parse: react.development.js (74430 bytes) - acorn           154 ops/s    15.2 ms/op 
        parse: react.development.js (74430 bytes) - esprima         124 ops/s     8.4 ms/op 
        parse: react.development.js (74430 bytes) - meriyah         392 ops/s       3 ms/op 

        walk: bootstrap.min.js (60010 bytes) - @babel/parser          8 ops/s   140.8 ms/op 
        walk: bootstrap.min.js (60010 bytes) - acorn                 56 ops/s      34 ms/op 
        walk: bootstrap.min.js (60010 bytes) - esprima               45 ops/s    28.3 ms/op 
        walk: bootstrap.min.js (60010 bytes) - meriyah              153 ops/s     7.7 ms/op 

        walk: jquery.min.js (88145 bytes) - @babel/parser             5 ops/s   176.7 ms/op 
        walk: jquery.min.js (88145 bytes) - acorn                    30 ops/s    60.5 ms/op 
        walk: jquery.min.js (88145 bytes) - esprima                  29 ops/s    33.8 ms/op 
        walk: jquery.min.js (88145 bytes) - meriyah                  93 ops/s    10.7 ms/op 

        walk: react.development.js (74430 bytes) - @babel/parser     24 ops/s    41.8 ms/op 
        walk: react.development.js (74430 bytes) - acorn            122 ops/s    18.6 ms/op 
        walk: react.development.js (74430 bytes) - esprima          134 ops/s     7.4 ms/op 
        walk: react.development.js (74430 bytes) - meriyah          264 ops/s     7.7 ms/op 
bench: 8m

```

## License

Licensed under MIT license.